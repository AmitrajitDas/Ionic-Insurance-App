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
        name: "email",
        "cf-questions": "Enter your email!",
        "cf-input-placeholder": "Email",
      },
      {
        tag: "input",
        type: "password",
        name: "password",
        "cf-questions": "Enter your password!",
        "cf-input-placeholder": "Password",
      },
    ]

    this.signupFields = [
      {
        tag: "input",
        type: "email",
        name: "email",
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
        name: "password",
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

  flowCallback = async (dto, success, error, auth) => {
    var formData = this.cf.getFormData(true)
    console.log("Formdata, obj:", formData)
    if (dto.tag.name === "email" && dto.tag.value.length > 0 && !auth) {
      const { email } = formData
      const { data } = await axios.post(`${process.env.REACT_APP_API}/signup`, {
        email,
      })
      console.log("API call", data)
    }
    if (dto.tag.name === "password" && dto.tag.value.length > 0) {
      const {
        otp,
        firstName,
        lastName,
        email,
        age,
        location,
        occupation,
        password,
      } = formData

      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/verify/user`,
          {
            otp,
            firstName,
            lastName,
            email,
            age,
            location,
            occupation,
            password,
          }
        )

        console.log(data.data.token)
        localStorage.setItem("token", JSON.stringify(data.data.token))
      } catch (error) {
        console.log(error)
      }
    }
    if (dto.tag.name === "password" && dto.tag.value.length > 0 && auth) {
      const { email, password } = formData
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/login/create-session`,
          {
            email,
            password,
          },
          { withCredentials: true }
        )
        console.log(data)
        // sessionStorage.setItem("user", JSON.stringify(data.data.user))
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
        flowStepCallback: this.flowCallback(auth),
        // loadExternalStyleSheet: false
      },
      tags: auth ? this.loginFields : this.signupFields,
    })
    this.elem.appendChild(this.cf.el)
  }

  submitCallback() {
    var formDataSerialized = this.cf.getFormData(true)
    console.log("Formdata, obj:", formDataSerialized)
    this.cf.addRobotChatResponse(
      "You are done. Check the dev console for form data output."
    )
  }
  render() {
    return (
      <div>
        <div ref={(ref) => (this.elem = ref)} />
      </div>
    )
  }
}
