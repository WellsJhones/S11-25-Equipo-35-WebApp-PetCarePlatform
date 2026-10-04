import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#F7F7F6",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#F7F7F6",
  },
  chipActive: {
    backgroundColor: "#628141",
    borderColor: "#628141",
  },
  chipText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  flexHalf: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 2,
  },
  unitButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#F7F7F6",
  },
  unitButtonActive: {
    backgroundColor: "#628141",
    borderColor: "#628141",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  unitTextActive: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#ea9b56",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
