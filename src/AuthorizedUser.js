import React, { useState, useEffect, useCallback } from 'react'
import {
  useNavigate,
} from "react-router-dom";
import {
  useQuery,
  useMutation,
  gql
} from "@apollo/client";
import { ROOT_QUERY } from './App'

const GITHUB_AUTH_MUTATION = gql`
    mutation githubAuth($code:String!) {
        githubAuth(code:$code) { token }
    }
`

const CurrentUser = ({ name, avatar, logout }) =>
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
  </div>

const Me = ({ logout, requestCode, signingIn }) => {
  const { loading, error, data } = useQuery(ROOT_QUERY);

  if (error) return <p>Error :(</p>;
  if (data?.me) {
    return <CurrentUser {...data.me} logout={logout} />
  }
  if (loading) {
    return <p>loading... </p>;
  } else {
    return <button
      onClick={requestCode}
      disabled={signingIn}>
      Sign In with GitHub
    </button>

  }
}


const AuthorizedUser = (props) => {
  console.log(props)
  const [githubAuth] = useMutation(GITHUB_AUTH_MUTATION, { refetchQueries: "all" });

  let navigate = useNavigate();
  let [signingIn, setSigningIn] = useState(false)




  useEffect(() => {
    // Update the document title using the browser API
    const authorizationComplete = (cache, { data }) => {
      localStorage.setItem('token', data.githubAuth.token)
      navigate("/", { replace: true })
      setSigningIn(false)
    }

    if (window.location.search.match(/code=/)) {
      setSigningIn(true)
      const code = window.location.search.replace("?code=", "")
      githubAuth({ variables: { code }, update: authorizationComplete })
    }
  }, [githubAuth, navigate]);

  const requestCode = () => {
    var clientID = '7a1f41b5a481a8282fc9'
    window.location =
      `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`
  }


  return (

    <Me signingIn={signingIn}
      requestCode={requestCode}
      logout={() => localStorage.removeItem('token')} />
  )

}

export default AuthorizedUser