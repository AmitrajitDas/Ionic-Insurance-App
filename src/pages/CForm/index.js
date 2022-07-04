import React from "react"
import { ConversationalForm } from "conversational-form"
import Robot from "../../assets/robot.png"
import User from "../../assets/user.png"
import { withRouter } from "react-router-dom"
import api from "../../api"
import { isPlatform } from "@ionic/react"
import { Storage } from "@capacitor/storage"
class MyForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      authUser: {},
      auth: false,
      loading: false,
      email: "",
      beneficiaryFlow: [],
      addbeneficiaryFlow: [],
      userType: "",
      beneficiaryID: "",
    }

    this.initForm = [
      {
        tag: "select",
        name: "authMethod",
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
      {
        tag: "select",
        name: "loginConfirm",
        "cf-questions": "Are you sure you've entered right credentials?",
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

  flowCallback = (dto, success, error) => {
    var formData = this.cf.getFormData(true)
    console.log("Formdata, obj:", formData)
    if (dto.tag.name === "authMethod" && !this.state.auth) {
      if (dto.tag.value[0] === "login") {
        this.setState({ auth: true })
        this.cf.addTags(this.loginFields, true, 1)
      } else if (dto.tag.value[0] === "signup") {
        this.cf.addTags(this.signupFields, true, 1)
      }
    }

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
          this.cf.addTags(this.policyField, true)
          console.log("login", res.data)
          this.setState({
            authUser: res.data.data,
            beneficiaryFlow: res.data.question,
          })
          if (isPlatform("hybrid"))
            Storage.set({ key: "user", value: res.data.data })
          else sessionStorage.setItem("user", JSON.stringify(res.data.data))
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => this.setState({ loading: false }))
    }

    if (dto.tag.name === "loginConfirm") {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "yes") {
        if (this.props.data.user) {
          this.cf.addRobotChatResponse("You are successfully Logged In")
        } else {
          error()
        }
      } else {
        window.location.reload(false)
      }
    }

    if (dto.tag.name === "flowMethod" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "decline") {
        this.props.data.logout()
        sessionStorage.clear()
        // const { history } = this.props
        // history.push("/")
      } else {
        this.cf.addTags(this.state.beneficiaryFlow, true, 1)
      }
    }

    if (dto.tag.name === "question" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      this.setState({ loading: true, userType: dto.tag.value[0] })
      // api
      //   .get("/hello")
      //   .then((res) => {
      //     console.log("test", res.data)
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     error()
      //   })
      this.setState({ loading: true })
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
            fullName: benifullName,
            email: beniEmail,
            age,
          })
        )
        .then((res) => {
          this.cf.addTags(this.browsePolicy, true, 1)
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
        api
          .get(`/getpoliciesforme/${this.state.beneficiaryID}`)
          .then((res) => {
            console.log("getPolicies", res.data)
          })
          .catch((err) => {
            console.log(err)
            error()
          })
      } else {
        const { history } = this.props
        history.push("/")
      }
    }

    success()
  }

  componentDidMount() {
    // var token = JSON.parse(localStorage.getItem("token"))
    // var auth = token ? true : false
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
      // tags: auth ? this.loginFields : this.signupFields,
      tags: this.initForm,
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
