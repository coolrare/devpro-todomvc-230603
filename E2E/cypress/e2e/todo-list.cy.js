describe("todo list 頁面功能", () => {
  before(() => {
    const api = Cypress.env("api");
    const username = Cypress.env("username");
    // 清空使用者的 todo list
    cy.request({
      method: "DELETE",
      url: `${api}/api/ForTesting/clear-todos/?username=${username}`,
    });
  });

  describe("尚未驗證", () => {
    it("未登入時，需要跳轉到登入頁面", () => {
      cy.visit(`${Cypress.env("host")}`);
      cy.url().should("include", "/login");
    });
  });

  describe("已驗證", () => {
    beforeEach(() => {
      cy.window()
        .its("localStorage")
        .invoke("setItem", "token", Cypress.env("token"));
      cy.visit(`${Cypress.env("host")}`);
    });

    it("登入時，需要跳轉到 todos 頁面", () => {
      cy.url().should("include", "/todos");
    });

    it.only("針對 todo list 進行操作", () => {
      cy.get(".todo-list li").should("have.length", 0);
      cy.get(".new-todo").click();

      // 輸入 Task 1
      cy.get(".new-todo").type("Task 1{enter}");
      cy.verifyLoading();
      cy.get(".todo-list li").should("have.length", 1);
      cy.get(".todo-list li").last().should("contain", "Task 1");

      // 輸入 Task 2
      cy.get(".new-todo").type("Task 2{enter}");
      cy.verifyLoading();
      cy.get(".todo-list li").should("have.length", 2);
      cy.get(".todo-list li").last().should("contain", "Task 2");

      // 輸入 Task 3
      cy.get(".new-todo").type("Task 3{enter}");
      cy.verifyLoading();
      cy.get(".todo-list li").should("have.length", 3);
      cy.get(".todo-list li").last().should("contain", "Task 3");

      // 將第二筆設為完成
      cy.get(".todo-list:nth-child(3) .toggle").click();
      cy.verifyLoading();
      cy.get(".todo-list:nth-child(3) li").should("have.class", "completed");

      // 將第三筆設為完成
      cy.get(".todo-list:nth-child(4) .toggle").click();
      cy.verifyLoading();
      cy.get(".todo-list:nth-child(4) li").should("have.class", "completed");

      // 將第二筆設為未完成
      cy.get(".todo-list:nth-child(3) .toggle").click();
      cy.verifyLoading();
      cy.get(".todo-list:nth-child(3) li").should(
        "not.have.class",
        "completed"
      );
    });
  });
});
