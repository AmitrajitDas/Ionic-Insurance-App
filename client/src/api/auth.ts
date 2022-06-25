import axios from "axios"

export const signup = async (email: string): Promise<void> => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API}/signup`,
    {
      email,
    },
    { withCredentials: true }
  )
}

export const verifySignup = async (
  otp: string,
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  age: number,
  location: string,
  occupation: string,
  password: string
): Promise<any> => {
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

export const login = async (email: string, password: string): Promise<any> => {
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

export const logout = async (): Promise<void> => {
  const { data } = await axios.post(`${process.env.REACT_APP_API}/logout`)
}
