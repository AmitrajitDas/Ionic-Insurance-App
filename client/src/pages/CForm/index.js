import React from "react"
import { ConversationalForm } from "conversational-form"
import useAuth from "../../context/useAuth"
import Robot from "../../assets/robot.png"
import User from "../../assets/user.png"
import axios from "axios"
export default class MyForm extends React.Component {
  constructor(props) {
    super(props)
    const { user, loading, error, signup, verifySignup, login, logout } =
      this.props.props
    console.log(loading)
    console.log(error)
    console.log(user)
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
        multiple: true,
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

  flowCallback = async (dto, success, error) => {
    var formData = this.cf.getFormData(true)
    console.log("Formdata, obj:", formData)
    if (dto.tag.name === "emailSignup" && dto.tag.value.length > 0) {
      const { emailSignup } = formData
      const { data } = await axios.post(`${process.env.REACT_APP_API}/signup`, {
        email: emailSignup,
      })
      console.log("API call", data)
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
        sessionStorage.setItem("user", JSON.stringify(data.data.user))
        this.cf.addRobotChatResponse("You are logged in successfully")
      } catch (error) {
        console.log(error)
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
