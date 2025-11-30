/**
 * ==> Simple but not the best way!
 * 1. from client side sent information
 * 2. Generate token jwt.sign()
 * 3. On the client side set token to the localstorage 
 * 
*/

/**
 * Using http only cookies
 * 
 * 1. From client side send the information (email, better: firebase er auth token)
 * 2. Ont the server side, accept user information and if needed validate it.
 * 3. Generate token in the server side. using secret and expiresIn
 * 
 * -----------------------
 * set the cookies
 * 4. While calling the api tell to use withCredentials
 * axios.post('http://localhost:5001/jwt', userData,{
                    withCredentials: true

    or for fetch add option credentials: 'include'

 * 5. In the cors setting set credentials and origin 
    app.use(cors({
      origin: ['http://localhost:5173'],
      credentials: true
    }));

    6. After generating the token set it to the cookies with some option
    res.cookie('token', token,{
        httpOnly: true,
        secure: false
      })


    ---------------------------
    7. On time: Use cookieParser as middleware.
    8. for every API you want to verify token: In the client side: If using axios withCredentials: true
    for fetch : credential include

    ----------------------------
  verify token
  8. check token exists. if not, return 401 --> unauthorized
  9. jwt. verify function. if error return 401 --> unauthorized
  10. if token is valid set the decoded value to the req object
  11. if data asking for doesn't match with the owner or bearer of the token --> 403 --> forbidden access
*/

/* 3 approach to jwt
ok type approach: 
1. Generate jwt > send to the client > store it in the local storage > send the token to the server using header>on the server verify token.

Best Approach in general: 
2. Generate token > set token to the cookies > ensure client and server exchanges cookies > on the server verify token.

firebase authentication approach: 
1. already have the token in the firebase (client side) > we will send the token to the server using auth header> verify the token
*/