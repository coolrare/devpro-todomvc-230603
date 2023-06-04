describe("template spec", () => {
  describe("有驗證狀態", () => {
    beforeEach(() => {
      cy.window()
        .its("localStorage")
        .invoke("setItem", "token", Cypress.env("token"));

      // 清空使用者的 todo list
      const api = Cypress.env("api");
      const username = Cypress.env("username");
      cy.request({
        method: "DELETE",
        url: `${api}/api/ForTesting/clear-todos/?username=${username}`,
      });

      cy.visit(`${Cypress.env("url")}`);
    });

    it("登入成功時，轉到 todos 頁面", () => {
      cy.url().should("include", "/todo");
    });

    it("新使用者，沒有代辦項目", () => {
      cy.get("ul").should("not.be.exist");
    });

    it("使用者可以自己新增代辦項目，並且會顯示在畫面上", () => {
      cy.get('.new-todo').type('Task 1{enter}');
      cy.get("ul").should("be.exist");
      cy.get("ul").should("have.length", 1);

      cy.get('.new-todo').type('Task 2{enter}');
      cy.get("ul").should("be.exist");
      cy.get("ul").should("have.length", 2);

      cy.get('.new-todo').type('Task 3{enter}');
      cy.get("ul").should("be.exist");
      cy.get("ul").should("have.length", 3);
    });

    it("使用者新增代辦項目後，可以將項目完成", () => {
      cy.get('.new-todo').type('Task 1{enter}');
      cy.get('.new-todo').type('Task 2{enter}');

      cy.get('.todo-list:nth-child(3) .toggle').click();
      cy.get('.todo-list:nth-child(3) li').should('have.class', 'completed');

      cy.get('.todo-list:nth-child(3) .toggle').click();
      cy.get('.todo-list:nth-child(3) li').should('not.have.class', 'completed');
    });
  });

  describe("沒有驗證狀態", () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env("url")}`);
    });
    it("還沒登入時，轉到 login 頁面", () => {
      cy.url().should("include", "/login");
    });
  });
});
