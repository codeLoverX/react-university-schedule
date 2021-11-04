import React, { useState, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UTMGate from "../resources/UTM_Gate.jpg";
import { getAuthDetails, getProfession, setAuthUser } from './SignInUpSlice';
import { Footer } from '../components/Footer';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
    bgPaper: {
        backgroundColor: "rgb(255, 255, 255, 0.8)",
        width: "40%",
        height: "min-content",
        margin: "auto"
    },
    bg: {
        margin: "0",
        paddingTop: "10vh",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${UTMGate})`,
        backgroundBlendMode: "overlay",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100vw 100vh",
    },
    paper: {
        paddingTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    '@media screen and (max-width: 1000px)': {
        bgPaper: {
            width: "100%",
            height: "min-content",
            marginTop: "10vh"
        },
        bg: {
            height: "100vh",
            backgroundImage: `url(${UTMGate})`,
            backgroundSize: "200vw 100vh",
        },

    }
}));

export default function SignInUp({ action, actionIsSignIn }) {
    // const dispatch = useDispatch();
    // dispatch(setSesiSemester({ sesi, semester }));
    let [failedLogin, setFailedLogin] = useState(false);
    let [username, setUserName] = useState("A18CS3026");
    let [password, setPassword] = useState("201901M10299");
    const classes = useStyles();
    function loginClick(evt) {
        evt.preventDefault();
        let auth_user = localStorage.getItem("auth_user");
        if (auth_user === "" || auth_user === null) {
            login(username, password);
        } else {
            alert("Already authenticated... Log out? ");
            logout();
        }
    }

    async function login(username, password) {
        let url = `http://web.fc.utm.my/ttms/web_man_webservice_json.cgi`
        let body = `entity=authentication&login=${username}&password=${password}`;
        url = `${url}?${body}`;
        let response = await fetch(url);
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("text/plain") !== -1) {
                // process your text/plain but!!! JSON data further
                // console.log("stopped here")
                try {
                    response = await response.json();
                }
                catch (error) {
                    setFailedLogin(true);
                    return;
                }
                // console.log("stopped here")

                let auth_user = JSON.stringify(response[0]);
                localStorage.setItem("auth_user", auth_user);
                loginAdmin(auth_user);
                localStorage.setItem("password", password);
            }
            else {
                // it is text data.
                response = await response.json();
                // console.log(response)
            }
        }
        else {
            console.log("response not okay")
        }
    }

    async function loginAdmin(auth_user) {
        let auth_user_object = JSON.parse(auth_user)
        let body = `session_id=${auth_user_object['session_id']}`;
        let url = "http://gmm.fc.utm.my/~mrazak/scsx3104/2021-1/TechExp3/auth4.php";
        url = `${url}?${body}`;
        let response = await (fetch(url));
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            // console.log({ contentType })
            if (contentType && contentType.indexOf("text/html") !== -1) {
                // it is text/html data jsonable as well.
                try {
                    response = await response.json();
                }
                catch (error) {
                    setFailedLogin(true);
                    return;
                }

            }
            let auth_admin = JSON.stringify(response[0]);
            localStorage.setItem("auth_admin", auth_admin);
            reloacte();
        }
        else {
            // reloacte();
            response = await response.json();
        }
    }


    function reloacte() {
        let local_auth_user = JSON.parse(localStorage.getItem("auth_user")) ?? {};
        setAuthUser({
            ...getAuthDetails(local_auth_user), profession: getProfession(local_auth_user)
        });
        // console.log({
        //     ...getAuthDetails(local_auth_user) || null
        // })
        // history.push('/timetable');
        // but doesn't render Timetable of course. just url changed by history.push!
        window.location.href = '/';
    }

    function logout() {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_admin");
        window.location.href = "/"
    }

    const inputUserName = useRef(null);
    const inputUserPassword = useRef(null);

    const [user, setUser] = React.useState('Student');

    const handleChange = (event) => {
        setUser(event.target.value)
        let currentUser= event.target.value; 
        console.log({currentUser})
        if (currentUser === "Student"){
            // usernameElement.value="A18CS3026"
            // passwordElement.value="201901M10299"
            setUserName("A18CS3026")
            setPassword("201901M10299")
        }
        else if(currentUser==="Teacher"){
            // usernameElement.value="12085"
            // passwordElement.value="S808323"
            setUserName("12085")
            setPassword("S808323")
        }
        else if(currentUser==="Admin"){
            // usernameElement.value="ad2021"
            // passwordElement.value="scsx3104"
            setUserName("ad2021")
            setPassword("scsx3104")
        }
        // S808323 12085
        // scsx3104 ad2021
        // A18CS3026 201901M10299
            // setUser(event.target.value);
    };

    return (
        <div className={classes.bg}>
            <Paper className={classes.bgPaper} >
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box className={classes.paper} fontWeight={900} >
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" >
                            {action}
                        </Typography>
                            <FormControl style={{margin: "10px 0"}}>
                                <InputLabel  id="demo-simple-select-label">User</InputLabel>
                                <Select
                                    
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={user}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Student">Student</MenuItem>
                                    <MenuItem value="Teacher">Teacher</MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="User name"
                                name="username"
                                autoComplete="username"
                                value={username}
                                autoFocus
                                ref={inputUserName}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                ref={inputUserPassword}
                                value={password}
                            />
                            {!actionIsSignIn &&
                                <Button
                                    type="submit"
                                    fontWeight="900"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    {action}
                                </Button>
                            }
                            {
                                failedLogin &&
                                <div id="failure">
                                    <Chip color="primary" label="Wrong username or password" variant="outlined" />
                                </div>
                            }
                            {actionIsSignIn &&
                                <>
                                    <Button
                                        type="submit"
                                        fontWeight="900"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        shadow={"primary"}
                                        onClick={loginClick}
                                    >
                                        {action}
                                    </Button>
                                </>
                            }

                        </form>
                    </Box>
                    <Box mt={2} fontWeight={900}>
                        <Footer />
                    </Box>
                </Container>
            </Paper>
        </div>
    );
}