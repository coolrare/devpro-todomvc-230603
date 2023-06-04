describe("template spec", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("url")}/login`);
  });

  it("輸入正確的帳號密碼後，應該可以成功登入，並轉到 todos 頁面", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.url().should("include", "/todo");

    cy.window()
      .its("localStorage") // window.localStorage
      .invoke("getItem", "token") // window.localStorage.getItem('token')
      .should("not.be.null");

    // 印出 token
    cy.window()
      .its("localStorage")
      .invoke("getItem", "token")
      .then((token) => {
        Cypress.log({
          name: "token",
          message: token,
        });
      });
  });

  it("輸入錯誤的帳號密碼後，應該跳出登入失敗的訊息", (done) => {
    cy.on("window:alert", (text) => {
      Cypress.log({ name: "window.alert", message: text });
      expect(text).to.equal("登入失敗");
      done();
    });

    cy.login("mike", "1234");
  });

  it("當按下登入按鈕時，應該出現 loading 畫面", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.get(".loading-container").should("be.exist");
    cy.get(".loading-container").should("not.be.exist");
  });
});
