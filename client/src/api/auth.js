import axios from "axios"

export const signup = async (email) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API}/signup`,
    {
      email,
    },
    { withCredentials: true }
  )
  console.log(data)
}

export const verifySignup = async (
  otp,
  firstName,
  middleName,
  lastName,
  email,
  age,
  location,
  occupation,
  password
) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API}/verify/user`,
    {
      otp,
      firstName,
      middleName,
      lastName,
      email,
      age,
      location,
      occupation,
      password,
    },
    { withCredentials: true }
  )
  return data
}

export const login = async (email, password) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API}/login/create-session`,
    {
      email,
      password,
    },
    { withCredentials: true }
  )

  return data
}

export const logout = async () => {
  const { data } = await axios.post(`${process.env.REACT_APP_API}/logout`)
}
