async function checkMockBreach(email) {
    const dummyBreaches = [
      {
        Name: "MockBreach",
        BreachDate: "2023-08-15",
        Description: "User emails were exposed in a test security incident."
      },
      {
        Name: "AnotherBreach",
        BreachDate: "2021-11-02",
        Description: "Leak of user email data during a fake password reset campaign."
      }
    ];
  
    if (email.includes("test")) {
      return dummyBreaches;
    } else {
      return [];
    }
  }
  
  module.exports = { checkMockBreach };
  