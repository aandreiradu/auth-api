Register/Auth API using express<br/>


<ul>
    <li>JWT : access & refresh token</li>
    <li>User Roles : protected routes based on user roles</li>
    <li>
        <p>Available Routes: <br/></p>
        <span> '/' -> for the moment, just a blank page</span><br/>
        <span>POST '/register' -> register new user. Checks for duplicate usernames. Passwords stored as hased using <b>bcrpyt</b> package</span>
        <span>POST '/auth' -> authenticate a user who already has an account. Based on providede credentials, will generate JWTs (access + refresh). 
            Access token is set to expire in 30s for the moment, refresh token expires in 1d. Refresh token will be stored in the cookies with <b>httpOnly</b> and accessToken will be sent in response.
        </span>
        <span>GET '/refresh' -> Generates a new access token if you already have an<b> refresh token</b> set up in the cookies(http only). Returns the new access token</span>
        <span>GET '/logout' -> Checks for an existing refresh token. Based on the response, will search for the user who has that token associated and it will reset the token</span>
        <div>
                <p> 
                    '/employees' <br/>
                    <span>GET -> returns all the employees. Needs authentification. Returns a list with all the users</span><br/>
                    <span>POST -> creates new user. Payload requires : firstname, lastname. Needs authentication and only users who are <b>'Admin' or 'Editor</b> can access this route. <b>Returns a list with all the useres</b></span><br/>
                    <span>PUT -> updates existing user. Payload requires: ID, firstname(optional),lastname(optional). Needs authentication and only users who are <b>'Admin' or 'Editor</b> can access this route. <b>Returns a list with the updated users</b></span><br/>
                    <span>DELETE -> delete existing user. Payload requires ID. Needs authenticationd and only users who are <b>'Admin'</b> can access this route.</span><br/>
                </p><br/>
                <hr/>
                <p>
                    '/employees/:id <br/>
                    <span>Returns an user based on his id. Payload requires: ID</span><br/>
                </p>
        </div>
    </li>
</ul>

<hr/>

<p>Recreated from scratch based on Dave Gray's NodeJS Crash Course. Link to YT channel : <a href='https://www.youtube.com/c/DaveGrayTeachesCode' target="_blank">here</a>. Thanks Dave!</p>