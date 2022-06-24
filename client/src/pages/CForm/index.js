import React from "react"
import { ConversationalForm } from "conversational-form"
import Robot from "../../assets/robot.png"
import User from "../../assets/user.png"
export default class MyForm extends React.Component {
  constructor(props) {
    super(props)

    this.formFields = [
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
        type: "number",
        name: "age",
        "cf-questions": "Enter your Age!",
        "cf-input-placeholder": "Age",
      },
    ]

    this.formFields2 = [
      {
        tag: "input",
        type: "text",
        name: "firstname",
        "cf-questions": "What is your firstname?",
        "cf-input-placeholder": "Firstname",
      },
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
      ...this.formFields,
    ]

    // this.formFields = [
    //   {
    //     tag: "input",
    //     type: "text",
    //     name: "firstname",
    //     "cf-questions": "What is your firstname?",
    //     "cf-input-placeholder": "Firstname",
    //   },
    //   {
    //     tag: "input",
    //     type: "email",
    //     name: "email",
    //     "cf-questions": "Enter your email!",
    //     "cf-input-placeholder": "Email",
    //   },
    //   {
    //     tag: "input",
    //     type: "password",
    //     name: "password",
    //     "cf-questions": "Enter a password!",
    //     "cf-input-placeholder": "Password",
    //   },
    //   {
    //     tag: "input",
    //     type: "text",
    //     name: "otp",
    //     "cf-questions": "Verify your account with the OTP sent to your email!",
    //     "cf-input-placeholder": "Verify OTP",
    //   },
    //   {
    //     tag: "input",
    //     type: "email",
    //     name: "email",
    //     "cf-questions": "Enter your email!",
    //     "cf-input-placeholder": "Email",
    //   },
    //   {
    //     tag: "input",
    //     type: "password",
    //     name: "password",
    //     "cf-questions": "Enter your password!",
    //     "cf-input-placeholder": "Password",
    //   },
    //   {
    //     tag: "input",
    //     type: "text",
    //     name: "location",
    //     "cf-questions": "What's your Location?",
    //     "cf-input-placeholder": "Location",
    //   },
    //   {
    //     tag: "input",
    //     type: "text",
    //     name: "occupation",
    //     "cf-questions": "What's your Occupation?",
    //     "cf-input-placeholder": "Occupation",
    //   },
    //   {
    //     tag: "select",
    //     name: "sex",
    //     "cf-questions": "Choose your Sex!",
    //     multiple: true,
    //     children: [
    //       { tag: "option", "cf-label": "Male", value: "male" },
    //       { tag: "option", "cf-label": "Female", value: "female" },
    //       { tag: "option", "cf-label": "Others", value: "others" },
    //     ],
    //   },
    //   {
    //     tag: "input",
    //     type: "text",
    //     name: "occupation",
    //     "cf-questions": "What's your Occupation?",
    //     "cf-input-placeholder": "Occupation",
    //   },
    // ]

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

  flowCallback = (dto, success, error) => {
    var formDataSerialized = this.cf.getFormData(true)
    console.log("Formdata, obj:", formDataSerialized)
    success()
  }

  componentDidMount() {
    var auth = false
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
      tags: auth ? this.formFields : this.formFields2,
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
