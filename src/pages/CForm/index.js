import React from "react"
import { ConversationalForm } from "conversational-form"
import Robot from "../../assets/robot.png"
import User from "../../assets/user.png"
import { withRouter } from "react-router-dom"
import api from "../../api"
import { isPlatform } from "@ionic/react"
import { Storage } from "@capacitor/storage"
import Cookies from "js-cookie"

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
      sample: "string",
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
      {
        tag: "select",
        name: "exitConfirm",
        "cf-questions": "Are you done with the process?",
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

    this.signupFields = [
      {
        tag: "input",
        type: "text",
        name: "fullName",
        "cf-questions": "What is your name?",
        "cf-input-placeholder": "Fullname",
      },
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
      {
        tag: "input",
        type: "text",
        name: "otp",
        "cf-questions": "Verify your account with the OTP sent to your email!",
        "cf-input-placeholder": "Verify OTP",
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

    this.browsePolicy = [
      {
        tag: "select",
        name: "browsePolicy",
        "cf-questions":
          "Do you want to browse policies that are suited for you?",
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

    this.policyField = [
      {
        tag: "select",
        name: "flowMethod",
        "cf-questions": "Do you want to buy quotations now?",
        multiple: false,
        children: [
          {
            tag: "option",
            "cf-label": "Proceed further, I want to choose quotations",
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

    this.submitCallback = this.submitCallback.bind(this)
  }

  logoutHandler = () => {
    this.props.data.logout()
    sessionStorage.clear()
    setTimeout(() => {
      const { history } = this.props
      history.push("/")
    }, 1000)
  }

  flowCallback = (dto, success, error) => {
    var formData = this.cf.getFormData(true)
    console.log("Formdata, obj:", formData)

    /// check for signup or login ///
    if (dto.tag.name === "authMethod" && !this.state.auth) {
      if (dto.tag.value[0] === "login") {
        this.setState({ auth: true })
        this.cf.addTags(this.loginFields, true, 1)
      } else if (dto.tag.value[0] === "signup") {
        this.cf.addTags(this.signupFields, true, 1)
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
        })
        .catch((err) => {
          console.log(err)
          error()
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
          this.cf.addRobotChatResponse("Your account is verified")
          this.cf.addTags(this.loginFields, true, 1)
          if (isPlatform("hybrid"))
            Storage.set({ key: "token", value: res.data.data.token })
          else
            localStorage.setItem("token", JSON.stringify(res.data.data.token))
        })
        .catch((err) => {
          console.log(err)
          error()
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
          this.cf.addTags(this.policyField, true, 1) // appending policyField as soon as we are logged in
          console.log("login", res.data)
          this.setState({
            authUser: res.data.data,
            beneficiaryFlow: res.data.question,
          })
          if (isPlatform("hybrid"))
            Storage.set({ key: "user", value: res.data })
          else sessionStorage.setItem("user", JSON.stringify(res.data))
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    // // intermediate for login api call
    // if (dto.tag.name === "loginConfirm") {
    //   console.log(dto.tag.value)
    //   if (dto.tag.value[0] === "yes") {
    //     if (this.props.data.user) {
    //       this.cf.addRobotChatResponse("You are successfully Logged In")
    //     } else {
    //       error()
    //     }
    //   } else {
    //     window.location.reload(false)
    //   }
    // }

    /// to handle if the user might come back later
    if (dto.tag.name === "flowMethod" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "decline") {
        this.logoutHandler()
      } else {
        this.cf.addTags(this.state.beneficiaryFlow, true, 1)
      }
    }

    // if user wanna buy policies for themselves or others
    if (dto.tag.name === "question" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      this.setState({ loading: true, userType: dto.tag.value[0] })
      api
        .get(`/getdetails/${dto.tag.value[0]}`)
        .then((res) => {
          this.cf.addTags(res.data.addBeneficiary, true, 1)
          console.log("getDetailForm", res.data)
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    // adding beneficiary
    if (dto.tag.name === "sex" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      this.setState({ loading: true })
      let userType = this.state.userType
      const {
        age,
        beniEmail,
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
            location,
            userID: this.state.authUser.userId,
            occupation,
            benificiaryRelation:
              userType === "self" ? "self" : benificiaryRelation,
            gender: sex[0],
            fullName:
              userType === "self" ? this.state.authUser.fullName : benifullName,
            email: userType === "self" ? this.state.authUser.email : beniEmail,
            age,
          })
        )
        .then((res) => {
          this.cf.addTags(this.browsePolicy, true, 1) // appending browsePolicy flow
          console.log("addBeni", res.data)
          this.setState({ beneficiaryID: res.data.msg.beneficiaryID })
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    if (dto.tag.name === "browsePolicy" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "yes") {
        // if user wants to browse through policies
        this.setState({ loading: true })
        api
          .get(`/getpoliciesforme/${this.state.beneficiaryID}`)
          .then((res) => {
            console.log("getPolicies", res.data)
            this.policies = [
              {
                tag: "select",
                name: "choosePolicyMethod",
                "cf-questions": "Choose your preferred policy!",
                multiple: false,
                children: res.data.k.map((policy) => ({
                  tag: "option",
                  "cf-label": `
                  <div style='padding: 2rem;'>
                  <div>policyID:${policy.policyID}</div>
                  <div>policyName:${policy.policyName}</div>
                  <div>basePrice:${policy.basePrice}</div>
                  <div>location:${policy.location}</div>
                  <div>occupation:${policy.occupation}</div>
                  <div>minAge:${policy.minAge}</div>
                  <div>maxAge:${policy.maxAge}</div>
                  <div>period:${policy.period}</div>
                  <div>gender:${policy.gender}</div>
                  <div>companyDiscount:${policy.companyDiscount}</div>
                  <div>govDiscount:${policy.govDiscount}</div>
                  <div>otherTax:${policy.otherTax}</div>
                  <div>gst:${policy.gst}</div>
                  </div>
                  `,
                  value: `${policy.policyName}`,
                })),
              },
            ]
            this.cf.addTags(this.policies, true, 1)
          })
          .catch((err) => {
            console.log(err)
            error()
          })
          .finally(() => this.setState({ loading: false }))
      } else {
        // else logout
        this.logoutHandler()
      }
    }

    if (dto.tag.name === "choosePolicyMethod" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      this.setState({ loading: true })
      api
        .post(
          "/buypolicy",
          JSON.stringify({
            beneficiaryID: this.state.beneficiaryID,
            policyName: dto.tag.value[0],
          })
        )
        .then((res) => {
          console.log("policy purchased", res.data)
          this.cf.addRobotChatResponse(
            `You've successfully purchased Policy : ${dto.tag.value[0]}`
          )
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    success()
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
    this.cf = ConversationalForm.startTheConversation({
      options: {
        theme: "purple",
        userImage: User,
        robotImage: Robot,
        flowStepCallback: this.flowCallback,
        submitCallback: this.submitCallback,
        preventAutoFocus: true,
        hideUserInputOnNoneTextInput: true,
        userInterfaceOptions: {
          controlElementsInAnimationDelay: 100,
          robot: {
            robotResponseTime: 0,
            chainedResponseTime: 400,
          },
        },
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
    this.props.data.logout()
  }
  render() {
    return (
      <div>
        <div ref={(ref) => (this.elem = ref)} />
      </div>
    )
  }
}

export default withRouter(MyForm)
