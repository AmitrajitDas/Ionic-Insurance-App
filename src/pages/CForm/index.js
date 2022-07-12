import React from "react"
import { ConversationalForm } from "conversational-form"
import Robot from "../../assets/robot.png"
import User from "../../assets/user.png"
import { withRouter } from "react-router-dom"
import api from "../../api"
import { isPlatform } from "@ionic/react"
import { Storage } from "@capacitor/storage"
import Cookies from "js-cookie"
import Modal from "../../components/Modal"

class MyForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      authUser: {}, // JSON.parse(sessionStorage.getItem("user")).data
      auth: false,
      // isUser: Cookies.get("InsuranceApp"),
      loading: false,
      email: "",
      beneficiaryFlow: [], // JSON.parse(sessionStorage.getItem("user")).question
      addbeneficiaryFlow: [],
      userType: "",
      beneficiaryID: "",
      continue: false,
      policyName: "",
      unboughtPolicies: [],
      modalOpen: false,
      browsePolicies: false,
      browseUnboughtPolicies: false,
    }

    this.initForm = [
      {
        tag: "select",
        name: "authMethod",
        type: "radio",
        "cf-questions":
          "Hey there, I'm Wingbot. I'll guide you through the process",
        multiple: false,
        children: [
          {
            tag: "option",
            "cf-label": "Are you a new user? Signup",
            value: "signup",
          },
          {
            tag: "option",
            "cf-label": "Already registered? Login",
            value: "login",
          },
        ],
      },
      // {
      //   tag: "select",
      //   name: "exitConfirm",
      //   "cf-questions": "Are you done with the process?",
      //   multiple: false,
      //   children: [
      //     {
      //       tag: "option",
      //       "cf-label": "Yes",
      //       value: "yes",
      //     },
      //     {
      //       tag: "option",
      //       "cf-label": "No",
      //       value: "no",
      //     },
      //   ],
      // },
    ]

    this.signupFields = [
      {
        tag: "input",
        type: "email",
        name: "emailSignup",
        "cf-questions": "Enter your email!",
        "cf-input-placeholder": "Email",
      },
      {
        tag: "input",
        type: "password",
        name: "passwordSignup",
        "cf-questions": "Enter a password!",
        "cf-input-placeholder": "Password",
      },
    ]

    this.loginFields = [
      {
        tag: "input",
        type: "email",
        name: "emailLogin",
        "cf-questions": "Enter your email!",
        "cf-input-placeholder": "Email",
      },
      {
        tag: "input",
        type: "password",
        name: "passwordLogin",
        "cf-questions": "Enter your password!",
        "cf-input-placeholder": "Password",
      },
      // {
      //   tag: "select",
      //   name: "loginConfirm",
      //   "cf-questions": "Are you sure you've entered right credentials?",
      //   multiple: false,
      //   children: [
      //     {
      //       tag: "option",
      //       "cf-label": "Yes",
      //       value: "yes",
      //     },
      //     {
      //       tag: "option",
      //       "cf-label": "No",
      //       value: "no",
      //     },
      //   ],
      // },
    ]

    this.policyField = [
      {
        tag: "select",
        name: "flowMethod",
        "cf-questions": "Do you want to add Beneficiaries?",
        multiple: false,
        children: [
          {
            tag: "option",
            "cf-label": "Proceed further",
            value: "proceed",
          },
          {
            tag: "option",
            "cf-label": "Show me unbought policies",
            value: "unbought",
          },
          {
            tag: "option",
            "cf-label": "No, I'll come back later",
            value: "decline",
          },
        ],
      },
    ]

    this.policyField2 = [
      {
        tag: "select",
        name: "flowMethod",
        "cf-questions": "Do you want to add Beneficiaries?",
        multiple: false,
        children: [
          {
            tag: "option",
            "cf-label": "Proceed further",
            value: "proceed",
          },
          {
            tag: "option",
            "cf-label": "No, I'll come back later",
            value: "decline",
          },
        ],
      },
    ]

    this.browsePolicy = [
      {
        tag: "select",
        name: "browsePolicy",
        "cf-questions":
          "Do you want to browse the quotations that are suited for you?",
        multiple: false,
        children: [
          {
            tag: "option",
            "cf-label": "Yes",
            value: "yes",
          },
          {
            tag: "option",
            "cf-label": "No",
            value: "no",
          },
        ],
      },
    ]

    this.submitCallback = this.submitCallback.bind(this)
  }

  newBeneficiaryForm = (userType, relation, dto, success, error) => {
    this.setState({ loading: true, userType })
    api
      .get(`/getdetails/${userType}/${relation}`)
      .then((res) => {
        console.log("getDetailForm", res.data)
        this.cf.addTags(res.data.addBeneficiary, true)
      })
      .catch((err) => {
        console.log(err)
        error()
      })
      .finally(() => this.setState({ loading: false }))
  }

  addBeneficiary = (dto, formData, success, error) => {
    this.setState({ loading: true })
    let userType = this.state.userType
    const {
      age,
      beneficiaryID,
      benifullName,
      location,
      occupation,
      sex,
      benificiaryRelation,
    } = formData

    api
      .post(
        `/addbeneficiary/${userType}`,
        JSON.stringify({
          beneficiaryID:
            userType === "self" ? this.state.authUser.userId : beneficiaryID,
          location: location[0],
          userID: this.state.authUser.userId,
          occupation: occupation[0],
          benificiaryRelation:
            userType === "self" ? "self" : benificiaryRelation[0],
          gender: sex[0],
          fullName:
            userType === "self" ? this.state.authUser.fullName : benifullName,
          age,
        })
      )
      .then((res) => {
        this.cf.addTags(this.browsePolicy, true) // appending browsePolicy flow
        console.log("addBeni", res.data)
      })
      .catch((err) => {
        console.log(err)
        error()
      })
      .finally(() => this.setState({ loading: false }))
  }

  getUnboughtPolicies = (dto, success, error) => {
    this.setState({ loading: true })
    api
      .post(
        "/getunboughtpolicies",
        JSON.stringify({
          userID: this.state.authUser.userId,
        })
      )
      .then((res) => {
        console.log("policy purchased", res.data)
        this.unboughtPolicies = [
          {
            tag: "select",
            name: "chooseUnboughtPolicy",
            "cf-questions": "Choose from unbought policies!",
            multiple: false,
            children: res.data.unboughtPolicies.map((policy) => ({
              tag: "option",
              "cf-label": `
                  <div style='padding: 2rem;'>
                  <div>policyID:${policy.policyID}</div>
                  <div>policyHolder_id:${policy.policyHolder_id}</div>
                  <div>buyerId:${policy.buyerId}</div>
                  </div>
                  `,
              value: `${policy.policyName}`,
            })),
          },
        ]
        this.cf.addTags(this.unboughtPolicies, true, 1)
        this.setState({ unboughtPolicies: res.data.unboughtUserPolicy })
      })
      .catch((err) => {
        console.log(err)
        error()
      })
      .finally(() => this.setState({ loading: false }))
  }

  checkUnboughtPolicies = (dto, success, error) => {
    this.setState({ loading: true })
    api
      .post("/getunboughtpolicies")
      .then((res) => {
        this.setState({ unboughtPolicies: res.data.unboughtPolicies })
      })
      .catch((err) => {
        console.log(err)
        return error()
      })
      .finally(() => this.setState({ loading: false }))
  }

  logoutHandler = () => {
    this.props.data.logout()
    sessionStorage.clear()
    setTimeout(() => {
      const { history } = this.props
      history.push("/")
    }, 1000)
  }

  pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  flowCallback = (dto, success, error) => {
    var formData = this.cf.getFormData(true)
    console.log("Formdata, obj:", formData)

    /// check for signup or login ///
    if (dto.tag.name === "authMethod" && !this.state.auth) {
      if (dto.tag.value[0] === "login") {
        this.setState({ auth: true })
        this.cf.addTags(this.loginFields, true)
      } else if (dto.tag.value[0] === "signup") {
        this.cf.addTags(this.signupFields, true)
      }
    }

    /// signup ///
    if (dto.tag.name === "passwordSignup" && dto.tag.value.length > 0) {
      const { fullName, emailSignup, passwordSignup } = formData
      let userID = Math.floor(Math.random() * 9000 + 1000)
      this.setState({ loading: true })
      api
        .post(
          "/signup",
          JSON.stringify({
            userID,
            fullName,
            email: emailSignup,
            password: passwordSignup,
          })
        )
        .then((res) => {
          console.log("signup", res.data)
          this.setState({ email: emailSignup })
          return res
        })
        .then((res) => {
          if (res.data?.data?.done === "yes") {
            console.log("otp block")
            this.cf.addTags(
              [
                {
                  tag: "input",
                  type: "text",
                  name: "otp",
                  "cf-questions":
                    "Verify your account with the OTP sent to your email!",
                  "cf-input-placeholder": "Verify OTP",
                },
              ],
              true
            )
          } else {
            console.log("login block")
            this.cf.addRobotChatResponse(res.data + " Login instead")
            this.cf.addTags(this.loginFields, true)
          }
        })
        .catch((err) => {
          console.log(err)
          this.cf.addRobotChatResponse(err.message)
          return error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    /// user verification ///
    if (dto.tag.name === "otp" && dto.tag.value.length > 0) {
      const { otp } = formData
      this.setState({ loading: true })
      api
        .post(
          "/verify/user",
          JSON.stringify({
            email: this.state.email,
            otp,
          })
        )
        .then((res) => {
          console.log("verify", res.data)
          if (isPlatform("hybrid"))
            Storage.set({ key: "token", value: res.data.data.token })
          else
            localStorage.setItem("token", JSON.stringify(res.data.data.token))
          return res
        })
        .then((res) => {
          this.cf.addRobotChatResponse(res.data.msg)
          this.cf.addTags(this.loginFields, true)
        })
        .catch((err) => {
          console.log(err)
          return error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    /// login ///
    if (dto.tag.name === "passwordLogin" && dto.tag.value.length > 0) {
      const { emailLogin, passwordLogin } = formData
      this.setState({ loading: true })
      api
        .post(
          "/login/create-session",
          JSON.stringify({
            email: emailLogin,
            password: passwordLogin,
          })
        )
        .then((res) => {
          console.log("login", res.data)
          this.setState({
            authUser: res.data.data,
            beneficiaryFlow: res.data.question,
          })
          if (isPlatform("hybrid"))
            Storage.set({ key: "user", value: res.data })
          else sessionStorage.setItem("user", JSON.stringify(res.data))
          this.checkUnboughtPolicies(dto, success, error)
          return res.data
        })
        .then((data) => {
          this.cf.addRobotChatResponse("You are successfully Logged In")
          if (this.state.unboughtPolicies.length !== 0) {
            this.cf.addTags(this.policyField, true) // appending policyField as soon as we are logged in
          } else {
            this.cf.addTags(this.policyField2, true)
          }
        })
        .catch((err) => {
          console.log(err)
          return error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    /// to handle if the user might come back later
    if (dto.tag.name === "flowMethod" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "decline") {
        this.logoutHandler()
      } else if (dto.tag.value[0] === "unbought") {
        // this.getUnboughtPolicies(dto, success, error)
        this.setState({ modalOpen: true, browseUnboughtPolicies: true })
      } else {
        this.cf.addTags(this.state.beneficiaryFlow, true)
      }
    }

    // if user wanna buy policies for themselves or others
    if (dto.tag.name === "question" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      if (dto.tag.value[0] === "self") {
        this.newBeneficiaryForm("self", "me", dto, success, error)
      } else {
        this.setState({ loading: true })
        api
          .get("/getrelations")
          .then((res) => {
            console.log("relation flow", res.data)
            this.cf.addTags(res.data.addRelation, true)
          })
          .catch((err) => {
            console.log(err)
            return error()
          })
          .finally(() => this.setState({ loading: false }))
      }
    }

    if (dto.tag.name === "benificiaryRelation" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      this.newBeneficiaryForm("others", dto.tag.value[0], dto, success, error)
    }

    // check if beneficiary already exists
    if (
      this.state.userType === "others" &&
      dto.tag.name === "beneficiaryID" &&
      dto.tag.value.length > 0
    ) {
      console.log(dto.tag.value)
      this.setState({ loading: true, beneficiaryID: dto.tag.value })
      api
        .post(
          "/findbeneficiary",
          JSON.stringify({ beneficiaryID: dto.tag.value })
        )
        .then((res) => {
          console.log("checkBeni", res.data)
          this.setState({ beneficiaryID: dto.tag.value })
          return res
        })
        .then((res) => {
          if (res.data.exist) {
            // this.cf.addTags(res.data.asktoAddnew, true)
            this.cf.addRobotChatResponse("Beneficiary already exists")
            this.cf.addTags(this.browsePolicy, true)
          }
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => this.setState({ loading: false }))
    } else if (this.state.userType === "self") {
      this.setState({
        loading: true,
        beneficiaryID: this.state.authUser.userId,
      })
      api
        .post(
          "/findbeneficiary",
          JSON.stringify({ beneficiaryID: this.state.authUser.userId })
        )
        .then((res) => {
          console.log("checkBeni", res.data)
          this.setState({ beneficiaryID: this.state.authUser.userId })
          return res
        })
        .then((res) => {
          if (res.data.exist) {
            // this.cf.addTags(res.data.asktoAddnew, true)
            this.cf.addRobotChatResponse("Beneficiary already exists")
            this.cf.addTags(this.browsePolicy, true)
          }
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    // if beneficiary already exists
    if (dto.tag.name === "addnewbeni" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      if (dto.tag.value[0] === "continue") {
        // skipping the beneficiary form
        if (this.state.auth) this.cf.remapTagsAndStartFrom(14, true, true)
        else this.cf.remapTagsAndStartFrom(18, true, true)
      } else {
        // this.cf.remapTagsAndStartFrom(16, true, true)
        // this.logoutHandler()
        this.newBeneficiaryForm("others", dto, success, error)
      }
      // else if (dto.tag.value[0] === "add other benificiary") {
      //   this.newBeneficiaryForm("others", dto, success, error)
      // }
    }

    // adding beneficiary if beneficiary doesn't exist
    if (dto.tag.name === "sex" && dto.tag.value[0] && !this.state.continue) {
      console.log(dto.tag.value)
      this.addBeneficiary(dto, formData, success, error)
    }

    if (dto.tag.name === "browsePolicy" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "yes") {
        this.setState({ modalOpen: true, browsePolicies: true })
      } else {
        // else logout
        this.logoutHandler()
      }
    }

    // if (dto.tag.name === "choosePolicy" && dto.tag.value[0]) {
    //   console.log(dto.tag.value[0])
    //   this.setState({ loading: true })
    //   api
    //     .post(
    //       "/bookpolicy",
    //       JSON.stringify({
    //         beneficiaryID: this.state.beneficiaryID,
    //         policyName: dto.tag.value[0],
    //       })
    //     )
    //     .then((res) => {
    //       console.log("policy booked", res.data)
    //       this.setState({ policyName: dto.tag.value[0] })
    //       this.cf.addRobotChatResponse(
    //         `You've successfully booked Policy : ${dto.tag.value[0]}`
    //       )
    //       this.cf.addTags(res.data.question, true)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       error()
    //     })
    //     .finally(() => this.setState({ loading: false }))
    // }

    // if (dto.tag.name === "makePayment" && dto.tag.value[0]) {
    //   console.log(dto.tag.value[0])
    //   console.log(formData.choosePolicy[0])
    //   if (dto.tag.value[0] === "yes") {
    //     this.setState({ loading: true })
    //     api
    //       .post(
    //         "/buypolicy",
    //         JSON.stringify({
    //           beneficiaryID: this.state.beneficiaryID,
    //           policyName: this.state.policyName,
    //         })
    //       )
    //       .then((res) => {
    //         this.cf.addTags(res.data.question, true)
    //       })
    //       .then((res) => {
    //         console.log("policy purchased", res.data)
    //         this.cf.addRobotChatResponse(
    //           `You've successfully purchased Policy : ${this.state.policyName}`
    //         )

    //         this.setState({ unboughtPolicies: res.data.unboughtUserPolicy })
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //         error()
    //       })
    //       .finally(() => this.setState({ loading: false }))
    //   } else {
    //     this.submitCallback()
    //   }
    // }

    // if (dto.tag.name === "noUnbought" && dto.tag.value[0]) {
    //   console.log(dto.tag.value[0])
    //   if (dto.tag.value[0] === "addbeni") {
    //     // backtrack
    //   }
    // }

    // if (dto.tag.name === "unbought" && dto.tag.value[0]) {
    //   console.log(dto.tag.value[0])
    //   if (dto.tag.value[0] === "yes") {
    //     this.getUnboughtPolicies(dto, success, error)
    //   } else {
    //     this.logoutHandler()
    //   }
    // }

    setTimeout(() => success(), 1000)
  }

  componentDidMount() {
    // var x = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)InsuranceApp\s*\=\s*([^;]*).*$)|^.*$/,
    //   "$1"
    // )
    // console.log(x)
    // if (this.state.isUser) {
    //   var { data } = JSON.parse(sessionStorage.getItem("user"))
    //   var loggedIn = data ? true : false
    // }
    // var user = JSON.parse(sessionStorage.getItem("user"))

    this.cf = ConversationalForm.startTheConversation({
      options: {
        theme: "purple",
        userImage: User,
        robotImage: Robot,
        flowStepCallback: this.flowCallback,
        submitCallback: this.submitCallback,
        preventAutoFocus: true,
        hideUserInputOnNoneTextInput: true,
        // userInterfaceOptions: {
        //   controlElementsInAnimationDelay: 1000,
        //   robot: {
        //     robotResponseTime: 1000,
        //     chainedResponseTime: 1000,
        //   },
        // },
        // loadExternalStyleSheet: false
      },
      tags: this.initForm,
      // tags: auth ? this.loginFields : this.signupFields,
      // tags: loggedIn ? this.policyField : this.initForm,
    })
    this.elem.appendChild(this.cf.el)
  }

  submitCallback() {
    var formDataSerialized = this.cf.getFormData(true)
    console.log("Formdata, obj:", formDataSerialized)
    this.cf.addRobotChatResponse("You are done. Thank You")
    // this.props.data.logout()
  }
  render() {
    return (
      <div>
        <div ref={(ref) => (this.elem = ref)} />
        {this.state.modalOpen && (
          <Modal
            modalOpen={this.state.modalOpen}
            browsePolicies={this.state.browsePolicies}
            browseUnboughtPolicies={this.state.browseUnboughtPolicies}
            beneficiaryID={this.state.beneficiaryID}
            userID={this.state.authUser.userId}
          />
        )}
      </div>
    )
  }
}

export default withRouter(MyForm)
