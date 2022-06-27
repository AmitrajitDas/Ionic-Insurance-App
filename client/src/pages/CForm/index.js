import React from "react"
import { ConversationalForm } from "conversational-form"
import useAuth from "../../context/useAuth"
import Robot from "../../assets/robot.png"
import User from "../../assets/user.png"
import axios from "axios"
import { withRouter } from "react-router-dom"

class MyForm extends React.Component {
  constructor(props) {
    super(props)
    const { user, loading, error, signup, verifySignup, login, logout } =
      this.props.props

    console.log(loading)
    console.log(error)
    console.log(user)

    this.state = {
      user: {},
    }

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
      ...this.policyField,
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
        type: "text",
        name: "otp",
        "cf-questions": "Verify your account with the OTP sent to your email!",
        "cf-input-placeholder": "Verify OTP",
      },
      {
        tag: "input",
        type: "text",
        name: "firstName",
        "cf-questions": "What is your firstname?",
        "cf-input-placeholder": "Firstname",
      },
      {
        tag: "input",
        type: "text",
        name: "lastName",
        "cf-questions": "What is your lastname?",
        "cf-input-placeholder": "Lastname",
      },

      {
        tag: "input",
        type: "number",
        name: "age",
        "cf-questions": "Enter your Age!",
        "cf-input-placeholder": "Age",
      },
      {
        tag: "input",
        type: "text",
        name: "location",
        "cf-questions": "What's your Location?",
        "cf-input-placeholder": "Location",
      },
      {
        tag: "input",
        type: "text",
        name: "occupation",
        "cf-questions": "What's your Occupation?",
        "cf-input-placeholder": "Occupation",
      },
      {
        tag: "select",
        name: "sex",
        "cf-questions": "Choose your Sex!",
        multiple: false,
        children: [
          { tag: "option", "cf-label": "Male", value: "male" },
          { tag: "option", "cf-label": "Female", value: "female" },
          { tag: "option", "cf-label": "Others", value: "others" },
        ],
      },
      {
        tag: "input",
        type: "password",
        name: "passwordSignup",
        "cf-questions": "Enter a password!",
        "cf-input-placeholder": "Password",
      },

      ...this.loginFields,
    ]

    this.submitCallback = this.submitCallback.bind(this)
  }

  // this.cf = ConversationalForm.startTheConversation({
  //   options: {
  //     dictionaryData: {
  //       'user-reponse-missing': `${this.props.crop_msg.c_test55}`,
  //       "input-placeholder" : `${this.props.crop_msg.placeholder}`        },
  //     eventDispatcher: dispatcher,
  //     submitCallback: this.submitCallback,
  //     hideUserInputOnNoneTextInput: true,
  //     flowStepCallback: this.flowCallback,
  //     userImage: USER_ICON,
  //     robotImage: LUNA_IMG,
  //     userInterfaceOptions: {
  //       controlElementsInAnimationDelay: 1,
  //       robot: {
  //         robotResponseTime: 0,
  //         chainedResponseTime: 0          }
  //     }
  //   },
  //   tags: startTags                                        // initialize json for cf-form    });
  // this.elem.appendChild(this.cf.el);

  logout = async (error) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API}/logout`)
    try {
      console.log(data)
      sessionStorage.clear()
      const { history } = this.props
      history.push("/")
    } catch (err) {
      this.cf.addRobotChatResponse(err)
      return error()
    }
  }

  flowCallback = async (dto, success, error) => {
    var formData = this.cf.getFormData(true)
    console.log("Formdata, obj:", formData)
    if (dto.tag.name === "emailSignup" && dto.tag.value.length > 0) {
      const { emailSignup } = formData
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/signup`,
          {
            email: emailSignup,
          }
        )
        console.log("API call", data)
      } catch (error) {
        console.log(error)
        this.cf.addRobotChatResponse(error)
        return error()
      }
    }
    if (dto.tag.name === "passwordSignup" && dto.tag.value.length > 0) {
      const {
        otp,
        firstName,
        lastName,
        emailSignup,
        age,
        location,
        occupation,
        passwordSignup,
      } = formData

      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/verify/user`,
          {
            otp,
            firstName,
            lastName,
            email: emailSignup,
            age,
            location,
            occupation,
            password: passwordSignup,
          }
        )

        console.log(data.data.token)
        localStorage.setItem("token", JSON.stringify(data.data.token))
        this.cf.addRobotChatResponse("You are signed up, now login")
      } catch (error) {
        console.log(error)
        this.cf.addRobotChatResponse(error)
        return error()
      }
    }
    if (dto.tag.name === "passwordLogin" && dto.tag.value.length > 0) {
      const { emailLogin, passwordLogin } = formData
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/login/create-session`,
          {
            email: emailLogin,
            password: passwordLogin,
          }
        )
        console.log(data)
        const { data: userData } = data
        const { user } = userData
        this.setState({ user })
        sessionStorage.setItem("user", JSON.stringify(user))
        this.cf.addRobotChatResponse("You are logged in successfully")
      } catch (error) {
        console.log(error)
        this.cf.addRobotChatResponse(error)
        return error()
      }
    }

    if (dto.tag.name === "flowMethod") {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "decline") {
        this.logout(error)
      } else {
        this.cf.addRobotChatResponse("Quotations are under development")
      }
    }
    success()
  }

  componentDidMount() {
    var token = JSON.parse(localStorage.getItem("token"))
    var auth = token ? true : false
    this.cf = ConversationalForm.startTheConversation({
      options: {
        theme: "purple",
        userImage: User,
        robotImage: Robot,
        submitCallback: this.submitCallback,
        preventAutoFocus: true,
        flowStepCallback: this.flowCallback,
        // loadExternalStyleSheet: false
      },
      tags: auth ? this.loginFields : this.signupFields,
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
      </div>
    )
  }
}

export default withRouter(MyForm)
