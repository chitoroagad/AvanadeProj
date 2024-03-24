"use client";

import Link from "next/link";
import styles from "./Start.module.css";
import { redirect } from "next/navigation";
import Logo from "./components/Logo";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./utils/contexts";
import { apiClient } from "./utils/api";

export default function Start() {
  const { isAuth, setIsAuth, username, setUsername } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;
    const formData = new FormData(form);
    console.log("formdata:", formData);
    try {
      setIsLoading(true); // Start loading before the API call

      // Directly pass the form data object, apiClient will handle JSON conversion
      const data = await apiClient.post("/login", Object.fromEntries(formData));

      // No need to parse response as JSON again, it's already done
      setIsLoading(false); // Stop loading after receiving the response
      localStorage.setItem("token", data.token); // Set token received from the response
      setUsername(data?.user?.name || "test"); // Set username received from the response or default to 'test'
      setError(""); // Clear any previous errors
      setIsAuth(true); // Set authentication flag to true
    } catch (err) {
      console.log(err);
      setError("Login request failed.");
    }
  };

  useEffect(() => {
    if (isAuth) redirect("/Home");
  }, [isAuth]);

  return (
    <main>
      <div className={styles.Start}>
        <div>
          <h1 className={styles.StartTitle}>Welcome Back!</h1>
        </div>
        <div className={styles.Box}>
          <div>
            <h2 className={styles.StartSubtitle}>Sign Into Your Account</h2>
          </div>
          <Image
            src="/start/msgicon.png"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "7%", height: "auto" }}
            className={styles.MsgIcon}
            alt="msg icon"
          />
          <form method="post" onSubmit={handleSubmit}>
            <div className={styles.LoginInfo}>
              <p>Email:</p>
              <input
                type="text"
                name="email"
                className={styles.Input}
                style={{ color: "black" }}
                placeholder="Enter Email here"
              ></input>
              <p>Password:</p>
              <input
                type="password"
                name="password"
                className={styles.Input}
                style={{ color: "black" }}
                placeholder="Enter Password here"
              ></input>
              {error && (
                <span
                  className="m-0 my-3 text-center mr-auto alert alert-error"
                  style={{ width: "80%" }}
                >
                  {error}
                </span>
              )}
            </div>
            <div className={styles.RemAndFor}>
              <div className={styles.RememberMe}>
                <label className="label cursor-pointer">
                  <span className="label-text">Remember me&nbsp;</span>
                  <input type="checkbox" className="checkbox" />
                </label>
              </div>
              <div className={styles.ForgotPwd}>
                <p>Forgot password?</p>
              </div>
            </div>
            <div className={styles.LoginBtn}>
              <button
                type="submit"
                className={`btn btn-wide ${
                  isLoading ? "btn-neutral" : "btn-primary"
                }`}
              >
                {isLoading && <span className="loading loading-spinner"></span>}
                Login
              </button>
            </div>
          </form>
          <div className={styles.SignUp}>
            <p>Don&apos;t have an account?</p>
            <div className={styles.SignUpText}>
              <Link href="/SignUp">
                <p>Sign Up</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/start/startpic.png"
        width={0}
        height={0}
        sizes="100vw"
        className={styles.StartPic}
        alt="start image"
      />
      <Image
        src="/start/background1.png"
        width={0}
        height={0}
        sizes="100vw"
        className={styles.StartBackground}
        alt="start background"
      />
      <div className={styles.Logo}>
        <Logo></Logo>
      </div>
    </main>
  );
}
