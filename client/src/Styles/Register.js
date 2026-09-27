import { StyleSheet } from "react-native";
import { colors } from "../Theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    position: "relative",
    backgroundColor: colors.background,
    paddingBottom: 40,
  },

  topImage: {
    width: 120,
    height: 120,
    alignSelf: "flex-start",
    pointerEvents: "none",
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },

  form: {
    width: "85%",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#393829",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: "#5F5F51",
    textAlign: "center",
    marginBottom: 25,
  },

  label: {
    color: "#393829",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },

  halfInput: {
    flex: 1,
  },

  input: {
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: 5,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  inputRowText: {
    flex: 1,
  },

  eye: {
    fontSize: 20,
    opacity: 0.6,
  },

  errorInput: {
    borderColor: "#FF6A6A",
  },

  errorMsg: {
    color: "#FF6A6A",
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
  },

  button: {
    backgroundColor: "#F28525",
    height: 50,
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 10,
    zIndex: 3,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  bottomText: {
    marginTop: 10,
    textAlign: "center",
    color: "#393829",
    fontSize: 14,
  },

  signIn: {
    color: "#F28525",
    fontWeight: "700",
    zIndex: 3,
  },

  bottomImage: {
    width: 145,
    height: 145,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 0,
    opacity: 0.6,
    pointerEvents: "none",
  },

  forgotPassword: {
    color: "#ea9b56",
    textAlign: "right",
    marginBottom: 8,
  },
});
