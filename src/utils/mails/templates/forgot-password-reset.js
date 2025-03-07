import * as React from 'react';
import { Html, Head, Container } from "@react-email/components";
const ForgotPasswordEmail = (props) => {
    const { otp } = props;
    return (React.createElement(Html, { lang: "en" },
        React.createElement(Head, null,
            React.createElement("title", null, " Neur CG Reset your password")),
        React.createElement(Container, null,
            React.createElement("h1", { style: { color: "black" } }, "Reset your password"),
            React.createElement("p", { style: { color: "black" } }, "Below is the otp for resetting your password."),
            " - ",
            React.createElement("b", { style: { color: "black" } }, otp),
            React.createElement("p", { style: { color: "#6c757d" } }, "If you did not request a password reset, please ignore this email."))));
};
export default ForgotPasswordEmail;
