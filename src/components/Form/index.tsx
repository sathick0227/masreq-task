import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
//material UI
import { Grid, Box, Typography, Stack, List, ListItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import AbcIcon from "@mui/icons-material/Abc";
import { Visibility, VisibilityOff } from "@mui/icons-material";

//Third Party Packages
import { useForm } from "react-hook-form";
import {
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../config/firebaseConfig";
import firebase from "firebase/app";

//Common strings
import { COLORS, ELEMENT, STRING } from "../../utils/common-strings";

//Validation schemas
import {
  email,
  password,
  firstname,
  lastname,
  confrimPwd,
} from "../../utils/validation-rules";
import { loginProp } from "../../utils/validation-rules";

//Reusable Component
import { InputBox } from "../input";
import Button from "../Button";
import {
  ErrorToast,
  SuccessToast,
  signInWithEmailPassword,
  signUpWithEmailPassword,
} from "../../utils/functions";
import { addUser } from "../../service/service";
type FormProp = {
  datas?: any;
  handleClose: () => void;
  flag?: string;
};
const Form: FC<FormProp> = ({ handleClose, datas, flag }) => {
  //Declaration
  const navigate = useNavigate();
  //States
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    getValues,
  } = useForm();

  const onSubmit = async (data: any) => {
    if (flag !== "edit") {
      signUpWithEmailPassword(data.email, data.password, data.firstname)
        .then((res: any) => {
          addUser(data)
            .then((res) => {
              SuccessToast("User Created Successfully");
            })
            .catch((err) => {
              ErrorToast(err);
            });
          handleClose();
        })
        .catch((err) => {
          ErrorToast(err);
        });
    } else {
      const updateUser = doc(firestore, "user", datas.id);
      try {
        await updateDoc(updateUser, data);
        SuccessToast("Document updated successfully");
      } catch (error: any) {
        ErrorToast("Error updating document");
      }
    }
  };

  const watchPassword = watch("password", "");

  const handleConfirmPasswordChange = (event: any) => {
    const confirmPassword = event.target.value;
    if (watchPassword && watchPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords don't match",
      });
    } else {
      setError("confirmPassword", {});
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Grid item xs={7} className="login-form">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid className="form">
          <h3 style={{ color: "black", textAlign: "center" }}>
            {flag === "edit" ? "Edit User" : "Add New User"}
          </h3>
          <Stack>
            <InputBox
              control={control}
              title={STRING.FIRSTNAME}
              name={ELEMENT.FIRSTNAME}
              type={ELEMENT.TEXT}
              rules={firstname}
              defaultValue={datas?.firstname}
              prefixIcon={<AbcIcon fontSize={"small"} />}
            />
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Stack sx={{ marginTop: "20px" }}>
                <InputBox
                  control={control}
                  title={STRING.MIDDLENAME}
                  name={ELEMENT.MIDDLENAME}
                  type={ELEMENT.TEXT}
                  defaultValue={datas?.middlename}
                  // rules={email}
                  prefixIcon={<AbcIcon fontSize={"small"} />}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack sx={{ marginTop: "20px" }}>
                <InputBox
                  control={control}
                  title={STRING.LASTNAME}
                  name={ELEMENT.LASTNAME}
                  type={ELEMENT.TEXT}
                  rules={lastname}
                  defaultValue={datas?.lastname}
                  prefixIcon={<AbcIcon fontSize={"small"} />}
                />
              </Stack>
            </Grid>
          </Grid>

          <Stack sx={{ marginTop: "20px" }}>
            <InputBox
              control={control}
              title={STRING.EMAIL}
              name={ELEMENT.EMAIL}
              type={ELEMENT.EMAIL}
              defaultValue={datas?.email}
              rules={email}
              prefixIcon={<MailIcon fontSize={"small"} />}
            />
          </Stack>
          {flag !== "edit" && (
            <>
              <Stack sx={{ marginTop: "20px" }}>
                <InputBox
                  control={control}
                  title={STRING.PASSWORD}
                  name={ELEMENT.PASSWORD}
                  type={showPassword ? ELEMENT.TEXT : ELEMENT.PASSWORD}
                  rules={password}
                  style={{ padding: "0px" }}
                  prefixIcon={<LockIcon fontSize={"small"} />}
                  suffixIcon={
                    showPassword ? (
                      <VisibilityOff
                        sx={{ fontSize: 20 }}
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Visibility
                        sx={{ fontSize: 20 }}
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                />
              </Stack>
              <Stack sx={{ marginTop: "20px" }}>
                <InputBox
                  control={control}
                  title={STRING.CONFIRM}
                  name={ELEMENT.CONFIRM}
                  type={showPassword2 ? ELEMENT.TEXT : ELEMENT.PASSWORD}
                  rules={{
                    required: "Confirm your Password",
                    validate: (value: any) =>
                      value === getValues(ELEMENT.PASSWORD) ||
                      "Passwords do not match",
                  }}
                  // onChange={handleConfirmPasswordChange}
                  style={{ padding: "0px" }}
                  prefixIcon={<LockIcon fontSize={"small"} />}
                  suffixIcon={
                    showPassword2 ? (
                      <VisibilityOff
                        sx={{ fontSize: 20 }}
                        onClick={() => setShowPassword2(false)}
                      />
                    ) : (
                      <Visibility
                        sx={{ fontSize: 20 }}
                        onClick={() => setShowPassword2(true)}
                      />
                    )
                  }
                />
              </Stack>
            </>
          )}

          <Grid
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "end",
              marginTop: "25px",
            }}
          >
            <Grid container xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}
              >
                <Stack>
                  <Button
                    type="submit"
                    color={COLORS.SUCCESS}
                    onClick={handleSubmit(onSubmit)}
                    value={flag === "edit" ? "Update" : "Add User"}
                  ></Button>
                </Stack>

                <Stack>
                  <Button
                    type={"button"}
                    color={COLORS.ERROR}
                    onClick={handleReset}
                    value={"Clear"}
                  ></Button>
                </Stack>
                <Stack>
                  <Button
                    type="submit"
                    onClick={handleClose}
                    value={"Close"}
                  ></Button>
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default Form;
