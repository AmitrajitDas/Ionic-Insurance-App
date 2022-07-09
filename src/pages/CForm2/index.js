import React, { useState, useEffect, useRef } from "react"
import { useHistory } from "react-router"
import { ConversationalForm } from "conversational-form"
import api from "../../api"
import { isPlatform } from "@ionic/react"
import { Storage } from "@capacitor/storage"
import Cookies from "js-cookie"
import Robot from "../../assets/robot.png"
import User from "../../assets/user.png"

export default function MyForm() {
  let cf = null
  const ref = useRef(null)
  const [loading, setLoading] = useState(false)
  const [auth, setAuth] = useState(false)
  const [authUser, setAuthUser] = useState({})
  const [beneficiaryFlow, setBeneficiaryFlow] = useState([])
  const [addbeneficiaryFlow, setAddbeneficiaryFlow] = useState([])
  const [resume, setResume] = useState(false)
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState("")
  const [beneficiaryID, setBeneficiaryID] = useState("")
  const [unboughtPolicies, setUnboughtPolicies] = useState([])
  const [policyName, setPolicyName] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const history = useHistory()

  const initForm = [
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

  const signupFields = [
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

  const loginFields = [
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

  const policyField = [
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

  const browsePolicy = [
    {
      tag: "select",
      name: "browsePolicy",
      "cf-questions": "Do you want to browse policies that are suited for you?",
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

  const newBeneficiaryForm = (userType, dto, success, error) => {
    setLoading(true)
    setUserType(userType)
    api
      .get(`/getdetails/${userType}`)
      .then((res) => {
        cf.addTags(res.data.addBeneficiary, true, 1)
        console.log("getDetailForm", res.data)
      })
      .catch((err) => {
        console.log(err)
        error()
      })
      .finally(() => setLoading(false))
  }

  const addBeneficiary = (dto, formData, success, error) => {
    setLoading(true)
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
          beneficiaryID: userType === "self" ? authUser.userId : beneficiaryID,
          location,
          userID: authUser.userId,
          occupation,
          benificiaryRelation:
            userType === "self" ? "self" : benificiaryRelation,
          gender: sex[0],
          fullName: userType === "self" ? authUser.fullName : benifullName,
          email: userType === "self" ? authUser.email : beniEmail,
          age,
        })
      )
      .then((res) => {
        cf.addTags(browsePolicy, true, 1) // appending browsePolicy flow
        console.log("addBeni", res.data)
      })
      .catch((err) => {
        console.log(err)
        error()
      })
      .finally(() => setLoading(false))
  }

  const getUnboughtPolicies = (dto, success, error) => {
    setLoading(true)
    api
      .post(
        "/getunboughtpolicies",
        JSON.stringify({
          userID: authUser.userId,
        })
      )
      .then((res) => {
        console.log("policy purchased", res.data)
        const unboughtPolicies = [
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
        cf.addTags(unboughtPolicies, true, 1)
        setUnboughtPolicies(res.data.unboughtUserPolicy)
      })
      .catch((err) => {
        console.log(err)
        error()
      })
      .finally(() => setLoading(false))
  }

  const logoutHandler = () => {
    api
      .post("/logout")
      .then((res) => {
        console.log("logout", res.data)
        setAuthUser(undefined)
      })
      .catch((err) => console.log(err))
    sessionStorage.clear()
    setTimeout(() => {
      history.push("/")
    }, 1000)
  }

  const flowCallback = (dto, success, error) => {
    var formData = cf.getFormData(true)
    console.log("Formdata, obj:", formData)

    /// check for signup or login ///
    if (dto.tag.name === "authMethod" && !auth) {
      if (dto.tag.value[0] === "login") {
        setAuth(true)
        cf.addTags(loginFields, true)
      } else if (dto.tag.value[0] === "signup") {
        cf.addTags(signupFields, true)
      }
    }
    /// signup ///
    if (dto.tag.name === "passwordSignup" && dto.tag.value.length > 0) {
      const { fullName, emailSignup, passwordSignup } = formData
      let userID = Math.floor(Math.random() * 9000 + 1000)
      setLoading(true)
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
          setEmail(emailSignup)
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => setLoading(false))
    }

    /// user verification ///
    if (dto.tag.name === "otp" && dto.tag.value.length > 0) {
      const { otp } = formData
      setLoading(true)
      api
        .post(
          "/verify/user",
          JSON.stringify({
            email,
            otp,
          })
        )
        .then((res) => {
          console.log("verify", res.data)
          cf.addRobotChatResponse("Your account is verified")
          cf.addTags(loginFields, true)
          if (isPlatform("hybrid"))
            Storage.set({ key: "token", value: res.data.data.token })
          else
            localStorage.setItem("token", JSON.stringify(res.data.data.token))
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => setLoading(false))
    }

    if (dto.tag.name === "passwordLogin" && dto.tag.value.length > 0) {
      const { emailLogin, passwordLogin } = formData
      setLoading(true)
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
          setAuthUser(res.data.data)
          setBeneficiaryFlow(res.data.question)
          if (isPlatform("hybrid"))
            Storage.set({ key: "user", value: res.data })
          else sessionStorage.setItem("user", JSON.stringify(res.data))
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => setLoading(false))
    }

    // intermediate for login api call
    if (dto.tag.name === "loginConfirm") {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "yes") {
        if (authUser) {
          cf.addRobotChatResponse("You are successfully Logged In")
          cf.addTags(policyField, true) // appending policyField as soon as we are logged in
        } else {
          error()
        }
      } else {
        window.location.reload(false)
      }
    }

    /// to handle if the user might come back later
    if (dto.tag.name === "flowMethod" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "decline") {
        logoutHandler()
      } else if (dto.tag.value[0] === "unbought") {
        getUnboughtPolicies(dto, success, error)
      } else {
        cf.addTags(beneficiaryFlow, true)
      }
    }

    // if user wanna buy policies for themselves or others
    if (dto.tag.name === "question" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      newBeneficiaryForm(dto.tag.value[0], dto, success, error)
    }

    // check if beneficiary already exists
    if (dto.tag.name === "beneficiaryID" && dto.tag.value.length > 0) {
      console.log(dto.tag.value)
      setLoading(true)
      api
        .post(
          "/findbeneficiary",
          JSON.stringify({ beneficiaryID: dto.tag.value })
        )
        .then((res) => {
          console.log("checkBeni", res.data)
          setBeneficiaryID(dto.tag.value)
          if (res.data.exist) {
            // this.cf.addTags(res.data.asktoAddnew, true)
            cf.addRobotChatResponse("Benificiary already exists")
            cf.addTags(browsePolicy, true)
          }
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => setLoading(false))
    }

    // if beneficiary already exists
    if (dto.tag.name === "addnewbeni" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      if (dto.tag.value[0] === "continue") {
        // skipping the beneficiary form
        if (auth) cf.remapTagsAndStartFrom(16, true, true)
        else cf.remapTagsAndStartFrom(20, true, true)
      } else {
        cf.remapTagsAndStartFrom(16, true, true)
        logoutHandler()
      }
      // else if (dto.tag.value[0] === "add other benificiary") {
      //   this.newBeneficiaryForm("others", dto, success, error)
      // }
    }

    // adding beneficiary if beneficiary doesn't exist
    if (dto.tag.name === "sex" && dto.tag.value[0]) {
      // && !resume
      console.log(dto.tag.value)
      addBeneficiary(dto, formData, success, error)
    }

    if (dto.tag.name === "browsePolicy" && dto.tag.value[0]) {
      console.log(dto.tag.value)
      if (dto.tag.value[0] === "yes") {
        // if user wants to browse through policies
        setLoading(true)
        api
          .get(`/getpoliciesforme/${beneficiaryID}`)
          .then((res) => {
            console.log("getPolicies", res.data)
            const policies = [
              {
                tag: "select",
                name: "choosePolicy",
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
            cf.addTags(policies, true)
          })
          .catch((err) => {
            console.log(err)
            error()
          })
          .finally(() => setLoading(false))
      } else {
        // else logout
        logoutHandler()
      }
    }

    if (dto.tag.name === "choosePolicy" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      setLoading(true)
      api
        .post(
          "/bookpolicy",
          JSON.stringify({
            beneficiaryID: beneficiaryID,
            policyName: dto.tag.value[0],
          })
        )
        .then((res) => {
          console.log("policy booked", res.data)
          setPolicyName(dto.tag.value[0])
          cf.addRobotChatResponse(
            `You've successfully booked Policy : ${dto.tag.value[0]}`
          )
          cf.addTags(res.data.question, true)
        })
        .catch((err) => {
          console.log(err)
          error()
        })
        .finally(() => setLoading(false))
    }

    if (dto.tag.name === "makePayment" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      console.log(formData.choosePolicy[0])
      if (dto.tag.value[0] === "yes") {
        setLoading(true)
        api
          .post(
            "/buypolicy",
            JSON.stringify({
              beneficiaryID,
              policyName,
            })
          )
          .then((res) => {
            cf.addTags(res.data.question, true)
          })
          .then((res) => {
            console.log("policy purchased", res.data)
            cf.addRobotChatResponse(
              `You've successfully purchased Policy : ${policyName}`
            )
            setUnboughtPolicies(res.data.unboughtUserPolicy)
          })
          .catch((err) => {
            console.log(err)
            error()
          })
          .finally(() => setLoading(false))
      } else {
        // submitCallback()
      }
    }

    // if (dto.tag.name === "noUnbought" && dto.tag.value[0]) {
    //   console.log(dto.tag.value[0])
    //   if (dto.tag.value[0] === "addbeni") {
    //     // backtrack
    //   }
    // }

    if (dto.tag.name === "unbought" && dto.tag.value[0]) {
      console.log(dto.tag.value[0])
      if (dto.tag.value[0] === "yes") {
        getUnboughtPolicies(dto, success, error)
      } else {
        logoutHandler()
      }
    }

    success()
  }

  useEffect(function mount() {
    cf = ConversationalForm.startTheConversation({
      options: {
        theme: "purple",
        userImage: User,
        robotImage: Robot,
        flowStepCallback: flowCallback,
        submitCallback: submitCallback,
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
      tags: initForm,
    })

    ref.current.appendChild(cf.el)

    return function unMount() {
      cf.remove()
    }
  }, [])

  const submitCallback = () => {
    var formDataSerialized = cf.getFormData(true)
    console.log("Formdata, obj:", formDataSerialized)
    cf.addRobotChatResponse("You are done. Thank You")
    // this.props.data.logout()
  }

  return (
    <div>
      <div ref={ref} />
    </div>
  )
}
