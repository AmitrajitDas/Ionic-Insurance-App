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
import Loader from "../../components/Loader"

class MyForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      authUser: JSON.parse(localStorage.getItem("user"))?.data, // JSON.parse(sessionStorage.getItem("user")).data
      auth: false,
      // isUser: Cookies.get("InsuranceApp"),
      loading: false,
      email: "",
      beneficiaryFlow: [], // JSON.parse(sessionStorage.getItem("user")).question
      addbeneficiaryFlow: [],
      userType: "",
      beneficiaryID: "",
      benificiaryRelation: "",
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
    ]

    this.policyField = [
      {
        tag: "select",
        name: "flowMethod",
        "cf-questions": "Do you want to buy policies for your family?",
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
        "cf-questions": "Do you want to buy policies for your family?",
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

  newBeneficiaryForm = async (userType, relation, dto, success, error) => {
    this.setState({ userType, benificiaryRelation: relation })
    this.setState({ loading: true })
    try {
      const { data } = await api.get(`/getdetails/${userType}/${relation}`)
      console.log("getDetailForm", data)
      if (data.addBeneficiary) {
        await this.cf.addTags(data.addBeneficiary, true)
      }
      if (data?.asktoAddnew) {
        await this.cf.addTags(data.asktoAddnew, true)
        await this.setState({ beneficiaryID: data.beneficiaryID })
        // await this.cf.addTags(this.browsePolicy, true)
      }
      this.setState({ loading: false })
    } catch (err) {
      this.setState({ loading: false })
      console.log(err)
      return error()
    }
  }

  addBeneficiary = async (dto, formData, success, error) => {
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

    this.setState({ loading: true })
    try {
      const { data } = await api.post(
        `/addbeneficiary/${userType}`,
        JSON.stringify({
          beneficiaryID: beneficiaryID,
          location: location[0],
          userID: this.state.authUser.userId,
          occupation: occupation[0],
          benificiaryRelation:
            userType === "self" ? "self" : benificiaryRelation[0],
          gender: sex && sex[0],
          fullName: benifullName,
          age,
        })
      )

      console.log("addBeni", data)
      if (data.msg === "give correct values!")
        await this.cf.addRobotChatResponse("Invalid ID")
      else {
        await this.setState({ beneficiaryID })
        await this.cf.addTags(this.browsePolicy, true) // appending browsePolicy flow
      }
      this.setState({ loading: false })
    } catch (err) {
      this.setState({ loading: false })
      console.log(err)
      return error()
    }
  }

  checkUnboughtPolicies = async (dto, success, error) => {
    this.setState({ loading: true })
    try {
      const { data } = await api.post("/getunboughtpolicies")
      console.log("unbought policies", data)
      this.setState({ unboughtPolicies: data.unboughtPolicies })
      this.setState({ loading: false })
    } catch (err) {
      this.setState({ loading: false })
      console.log(err)
      return error()
    }
  }

  logoutHandler = async () => {
    this.setState({ loading: true })
    try {
      const { data } = await api.post("/logout")
      console.log("logout", data)
      this.setState({ loading: false })
      setTimeout(() => {
        localStorage.clear()
        const { history } = this.props
        history.push("/")
      }, 1000)
    } catch (err) {
      this.setState({ loading: false })
      console.log(err)
    }
  }

  pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  flowCallback = async (dto, success, error) => {
    var formData = this.cf.getFormData(true)
    console.log("Formdata, obj:", formData)

    /// check for signup or login ///
    if (dto.tag.name === "authMethod" && !this.state.auth) {
      if (dto.tag.value[0] === "login") {
        this.setState({ auth: true })
        await this.cf.addTags(this.loginFields, true)
      } else if (dto.tag.value[0] === "signup") {
        await this.cf.addTags(this.signupFields, true)
      }
    }

    /// signup ///
    if (dto.tag.name === "passwordSignup" && dto.tag.value.length > 0) {
      const { fullName, emailSignup, passwordSignup } = formData
      this.setState({ loading: true })
      try {
        const { data } = await api.post(
          "/signup",
          JSON.stringify({
            fullName,
            email: emailSignup,
            password: passwordSignup,
          })
        )

        console.log("signup", data)
        this.setState({ email: emailSignup })
        if (data?.data?.done === "yes") {
          console.log("otp block")
          await this.cf.addTags(
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
          await this.cf.addRobotChatResponse(data.msg + " Login instead")
          await this.cf.addTags(this.loginFields, true)
        }
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
        console.log(err.response.data)
        await this.cf.addRobotChatResponse(err.response.data.msg)
        return error()
      }
    }

    /// user verification ///
    if (dto.tag.name === "otp" && dto.tag.value.length > 0) {
      const { otp } = formData
      this.setState({ loading: true })
      try {
        const { data } = await api.post(
          "/verify/user",
          JSON.stringify({
            email: this.state.email,
            otp,
          })
        )
        console.log("verify", data)
        localStorage.setItem("token", JSON.stringify(data.data.token))
        await this.cf.addRobotChatResponse(data.msg)
        await this.cf.addRobotChatResponse("Let's log you in")
        await this.cf.addTags(this.loginFields, true)
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
        console.log(err)
        await this.cf.addRobotChatResponse(err.msg)
        return error()
      }
    }

    /// login ///
    if (dto.tag.name === "passwordLogin" && dto.tag.value.length > 0) {
      const { emailLogin, passwordLogin } = formData
      this.setState({ loading: true })
      try {
        const { data } = await api.post(
          "/login/create-session",
          JSON.stringify({ email: emailLogin, password: passwordLogin })
        )
        console.log("login", data)
        this.setState({
          authUser: data.data,
          beneficiaryFlow: data.question,
        })

        localStorage.setItem("user", JSON.stringify(data))
        await this.checkUnboughtPolicies(dto, success, error) // check for unbought policies for that user
        await this.cf.addRobotChatResponse("You are successfully Logged In")

        // appending policyField as soon as we are logged in
        if (this.state?.unboughtPolicies?.length > 0) {
          await this.cf.addTags(this.policyField, true)
        } else {
          await this.cf.addTags(this.policyField2, true)
        }
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
        console.log(err)
        await this.cf.addRobotChatResponse(err.msg)
        return error()
      }
    }

    /// to handle if the user might come back later
    if (dto.tag.name === "flowMethod" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "decline") {
        await this.logoutHandler()
      } else if (dto.tag.value[0] === "unbought") {
        // this.getUnboughtPolicies(dto, success, error)
        this.setState({
          browseUnboughtPolicies: true,
          browsePolicies: false,
          modalOpen: true,
        })
        this.cf.addTags([
          {
            tag: "select",
            name: "flowContinue",
            "cf-questions": "Would you like to browse more premiums?",
            multiple: false,
            children: [
              {
                tag: "option",
                "cf-label": "Yes, show me more",
                value: "yes",
              },
              {
                tag: "option",
                "cf-label": "No, I'm done for now",
                value: "no",
              },
            ],
          },
        ])
        // this.props.data.openModal()
      } else {
        await this.cf.addTags(this.state.beneficiaryFlow, true)
      }
    }

    // if user wanna buy policies for themselves or others
    if (dto.tag.name === "question" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      if (dto.tag.value[0] === "self") {
        await this.newBeneficiaryForm("self", "me", dto, success, error)
      } else {
        try {
          const { data } = await api.get("/getrelations")
          console.log("relation flow", data)
          await this.cf.addTags(data.addRelation, true)
        } catch (err) {
          console.log(err)
          return error()
        }
      }
    }

    if (dto.tag.name === "benificiaryRelation" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      await this.newBeneficiaryForm(
        "others",
        dto.tag.value[0],
        dto,
        success,
        error
      )
    }

    // check if beneficiary already exists
    if (
      this.state.userType === "others" &&
      dto.tag.name === "beneficiaryID" &&
      dto.tag.value.length > 0
    ) {
      console.log(dto.tag.value)
      this.setState({ loading: true })
      try {
        const { data } = await api.post(
          "/findbeneficiary",
          JSON.stringify({ beneficiaryID: dto.tag.value })
        )
        console.log("checkBeni", data)
        this.setState({ beneficiaryID: dto.tag.value })
        if (data.msg !== "benificiary not found")
          await this.cf.addTags(data.asktoAddnew, true)
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
        console.log(err)
        return error()
      }
    } else if (
      this.state.userType === "self" &&
      dto.tag.name === "beneficiaryID" &&
      dto.tag.value.length > 0
    ) {
      console.log(dto.tag.value)
      this.setState({ loading: true })
      try {
        const { data } = await api.post(
          "/findbeneficiary",
          JSON.stringify({ beneficiaryID: dto.tag.value })
        )
        console.log("checkBeni", data)
        this.setState({ beneficiaryID: dto.tag.value })
        // this.cf.addTags(res.data.asktoAddnew, true)
        if (data.msg !== "benificiary not found") {
          await this.cf.addRobotChatResponse("Beneficiary already exists")
          await this.cf.addTags(this.browsePolicy, true)
        }
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
        console.log(err)
        return error()
      }
    }

    // if beneficiary already exists
    if (dto.tag.name === "addnewbeni" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      if (dto.tag.value[0] === "continue") {
        // skipping the beneficiary form
        console.log("continue")
        await this.cf.addTags(this.browsePolicy, true)
      } else {
        // this.cf.remapTagsAndStartFrom(16, true, true)
        // this.logoutHandler()
        try {
          const { data } = await api.get("/getrelations")
          console.log("relation flow", data)
          await this.cf.addTags(data.addRelation, true)
          // await this.newBeneficiaryForm("others", dto, success, error)
        } catch (err) {
          console.log(err)
          return error()
        }
      }
    }

    // adding beneficiary if beneficiary doesn't exist

    if (
      (dto.tag.name === "sex" && dto.tag.value[0]) ||
      (dto.tag.name === "occupation" &&
        dto.tag.value[0] &&
        this.state.benificiaryRelation !== "friend" &&
        this.state.benificiaryRelation !== "me")
    ) {
      //this.state.continue
      console.log(dto.tag.value)
      await this.addBeneficiary(dto, formData, success, error)
    }

    if (dto.tag.name === "browsePolicy" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "yes") {
        this.setState({
          browsePolicies: true,
          browseUnboughtPolicies: false,
          modalOpen: true,
        })
        this.cf.addTags([
          {
            tag: "select",
            name: "flowContinue",
            "cf-questions": "Would you like to browse more premiums?",
            multiple: false,
            children: [
              {
                tag: "option",
                "cf-label": "Yes, show me more",
                value: "yes",
              },
              {
                tag: "option",
                "cf-label": "No, I'm done for now",
                value: "no",
              },
            ],
          },
        ])
        // this.props.data.openModal()
      } else {
        // else logout
        await this.logoutHandler()
      }
    }

    if (dto.tag.name === "flowContinue" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      this.setState({ modalOpen: false })
      if (dto.tag.value[0] === "yes") {
        await this.checkUnboughtPolicies(dto, success, error)
        if (this.state?.unboughtPolicies?.length > 0) {
          await this.cf.addTags(this.policyField, true)
        } else {
          await this.cf.addTags(this.policyField2, true)
        }
      }
    }

    // if (this.state.modalOpen) {
    //   this.setState({ modalOpen: false })
    // }

    success()
  }

  // closeModal = () => {
  //   this.setState({ modalOpen: false })
  // }

  componentDidMount() {
    this.cf = ConversationalForm.startTheConversation({
      options: {
        theme: "purple",
        userImage: User,
        robotImage: Robot,
        flowStepCallback: this.flowCallback,
        submitCallback: this.submitCallback,
        preventAutoFocus: true,
        hideUserInputOnNoneTextInput: true,
      },
      tags: this.initForm,
    })
    this.elem.appendChild(this.cf.el)
  }

  submitCallback() {
    var formDataSerialized = this.cf.getFormData(true)
    console.log("Formdata, obj:", formDataSerialized)
    this.cf.addRobotChatResponse("You are done. Thank You")
  }
  render() {
    return (
      <div>
        <div ref={(ref) => (this.elem = ref)} />
        {this.state.loading && <Loader formloader={this.state.loading} />}
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
