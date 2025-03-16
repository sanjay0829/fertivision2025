import UserModel from "@/models/user";

const generateRegistrationNumber = async (): Promise<string> => {
  try {
    const lastEntry = await UserModel.findOne()
      .sort({ createdAt: -1 })
      .select("reg_no")
      .exec();

    const prefix = "AG";
    let newIdNumber = 1;

    if (lastEntry) {
      const lastId = lastEntry.reg_no;
      const LastIdNumber = parseInt(lastId.replace(prefix, ""), 10);
      newIdNumber = LastIdNumber + 1;
    }

    return `${prefix}${newIdNumber.toString().padStart(4, "0")}`;
  } catch (error) {
    console.log("Error in genrating reg. no.", error);

    return "";
  }
};

export default generateRegistrationNumber;
