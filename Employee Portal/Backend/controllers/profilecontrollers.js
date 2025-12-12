// Backend/controllers/profilecontrollers.js
const { profileService } = require("../services/profileservices");
const xml2js = require("xml2js");

exports.profileController = async (req, res) => {
  try {
    const empId = req.query.empId; // GET PARAM

    if (!empId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const soapResponse = await profileService(empId);

    xml2js.parseString(soapResponse, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ message: "Error parsing XML" });

      const body =
        result["soap-env:Envelope"]["soap-env:Body"]
          ["n0:ZEMP_PROFILE780_FMResponse"];

      const profile = body.E_PROFILE_DATA;

      return res.json({
        message: body.E_MESSAGE,
        profile: {
          empId: profile.EMPID,
          firstName: profile.FIRST_NAME,
          lastName: profile.LAST_NAME,
          dob: profile.DOB,
          gender: profile.GENDER,
          nationality: profile.NATIONALITY,
          email: profile.EMAIL,
          position: profile.POSITION,
          orgUnit: profile.ORG_UNIT,
          payrollArea: profile.PAYROLL_AREA,
          employeeGroup: profile.EMPLOYEE_GROUP,
          companyCode: profile.COMPANY_CODE
        }
      });
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
