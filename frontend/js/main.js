// Điểm vào của SPA: khai báo bảng route rồi khởi động router.
import { addRoute, start } from "./router.js";
import * as home from "./pages/home.js";
import * as login from "./pages/login.js";
import * as khach from "./pages/khach.js";
import * as listing from "./pages/listing.js";
import * as dishDetail from "./pages/dish-detail.js";
import * as adminForm from "./pages/admin-form.js";
import * as adminDelete from "./pages/admin-delete.js";
import * as register from "./pages/register.js";
import * as forgot from "./pages/forgot.js";
import * as reset from "./pages/reset.js";
import * as mfaVerify from "./pages/mfa-verify.js";
import * as security from "./pages/security.js";
import { RES } from "./resources.js";
import { dangXuat } from "./state.js";
import { navigate } from "./router.js";

// ----- khu vực khách -----
addRoute("/", home.load);
addRoute("/login", login.load);
addRoute("/register", register.load);
addRoute("/forgot-password", forgot.load);
addRoute("/reset-password", reset.load);
addRoute("/mfa", mfaVerify.load);
addRoute("/khach", khach.load);
addRoute("/dishes", (ctx) => listing.load(ctx, "dishes", false));
addRoute("/dishes/:id", dishDetail.load);

// ----- tài khoản: phải đăng nhập -----
addRoute("/account/security", security.load, { auth: true });

// ----- khu vực quản trị: phải đăng nhập; quyền từng thao tác do server quyết định (RBAC/ABAC) -----
addRoute("/admin", () => ({ redirect: "/admin/dishes" }));
Object.keys(RES).forEach((key) => {
  // thứ tự quan trọng: /new phải đứng trước /:id
  addRoute(`/admin/${key}`, (ctx) => listing.load(ctx, key, true), { auth: true });
  addRoute(`/admin/${key}/new`, (ctx) => adminForm.load(ctx, key), { auth: true });
  addRoute(`/admin/${key}/:id/edit`, (ctx) => adminForm.load(ctx, key), { auth: true });
  addRoute(`/admin/${key}/:id/delete`, (ctx) => adminDelete.load(ctx, key), { auth: true });
});

// nút "Đăng xuất" ở thanh trên (thanhTren trong utils.js); ủy quyền sự kiện vì thanh trên được vẽ lại mỗi màn hình
document.addEventListener("click", async (e) => {
  if (!e.target.closest || !e.target.closest("[data-dang-xuat]")) return;
  await dangXuat();
  navigate("/login", { fx: { type: "nuoc" }, flash: "Đã đăng xuất." }); // nước tràn như đăng xuất bằng thuyền
});

start(document.getElementById("app"));
