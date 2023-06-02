describe("登入功能", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("host")}/login`);
  });

  it("輸入正確的帳號密碼可以成功登入", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    cy.url().should("include", "/todo");
  });

  it("輸入正確的帳號密碼後，需要將 access token 存入 local storage", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));

    // 轉到 todo 頁面後，檢查是否包含 token
    // cy.url().should("include", "/todo");
    // cy.window().then(win => {
    //   expect(win.localStorage.getItem("token")).is.not.null;
    // })

    // 用 Cypress 內建的 should，可以不用測試跳轉頁面後的行為，直接等待 token 存入 local storage
    cy.window()
      .its("localStorage")
      .invoke("getItem", "token")
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

  it("輸入錯誤的帳號密碼會顯示錯誤訊息", (done) => {
    cy.on("window:alert", (text) => {
      Cypress.log({ name: "test", message: text });
      expect(text).to.equal("登入失敗");
      done();
    });

    cy.login("test", "test");
  });

  it("按下登入按鈕後，顯示 loading 畫面，完成後消失", () => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.verifyLoading();
  });
});
