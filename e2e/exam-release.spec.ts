import { test, expect } from "@playwright/test";
import { signInWithDocuments } from "./document-fixture";
test("teacher reviews legacy key, previews multiple codes and publishes an immutable re-openable print bundle", async ({
  page,
}) => {
  await signInWithDocuments(page);
  await page.goto("/doc/mau-de-toan-9-20-cau");
  await page
    .getByRole("button", { name: "Chốt đề & xuất PDF", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Các mã đề").fill("101, 102");
  await dialog.getByRole("checkbox", { name: /Các đoạn trước câu đầu/ }).check();
  await dialog
    .getByRole("checkbox", { name: /Tôi đã đối chiếu barem cũ/ })
    .check();
  await dialog
    .getByRole("button", { name: "Tạo & kiểm tra các mã đề", exact: true })
    .click();
  await expect(
    dialog.getByRole("button", { name: "Mã 101", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Mã 102", exact: true }),
  ).toBeVisible();
  const frame = page.frameLocator('iframe[title="Xem trước mã đề"]');
  await expect(frame.locator("body")).toContainText("Mã đề 101");
  await expect(frame.locator("body")).not.toContainText("HƯỚNG DẪN CHẤM");
  await dialog.getByRole("button", { name: "Mã 102", exact: true }).click();
  await expect(frame.locator("body")).toContainText("Mã đề 102");
  const publish = dialog.getByRole("button", {
    name: "Chốt bộ in & tạo đợt chấm",
  });
  await expect(publish).toBeDisabled();
  await dialog
    .getByRole("checkbox", { name: /Tôi đã rà soát tất cả mã/ })
    .check();
  await publish.click();
  await expect(dialog.getByText(/Đã chốt bộ in:/)).toBeVisible({
    timeout: 20000,
  });
  await dialog.getByRole("link", { name: "Mở bộ in & chụp chấm" }).click();
  await expect(page).toHaveURL(/\/exam-releases\/[^/]+$/);
  await expect(
    page.getByRole("heading", { name: "Chụp chấm nhiều mã đề" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Mã 101 — xem & duyệt điểm" }),
  ).toBeVisible();
  await page.getByLabel("Loại bản in").selectOption("sheet");
  const stored = page.frameLocator('iframe[title="Bản in bất biến"]');
  await expect(stored.locator(".bubble").first()).toBeVisible();
  await expect(stored.locator("body")).toContainText("101");
  await expect(stored.locator("body")).toContainText("102");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Chụp chấm nhiều mã đề" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("published flow does not claim a missing barem is gradeable", async ({
  page,
}) => {
  await signInWithDocuments(page);
  await page.goto("/doc/demo-de-giua-ky-toan-9");
  await page
    .getByRole("button", { name: "Chốt đề & xuất PDF", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByText(/Chưa có đáp án liên kết/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Tạo & kiểm tra các mã đề", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Chỉ in nhanh, không liên kết chấm" })
    .click();
  await expect(
    page.frameLocator('iframe[title="Xem trước bản in"]').locator("body"),
  ).toContainText("Căn bậc hai");
});
