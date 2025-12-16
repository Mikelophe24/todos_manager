# 👥 Admin Dashboard - User Guide

## 📖 Giới thiệu

Admin Dashboard là công cụ quản lý users mạnh mẽ với giao diện trực quan và nhiều tính năng tiện lợi. Bạn có thể dễ dàng tìm kiếm, lọc, sắp xếp và thực hiện các thao tác hàng loạt trên danh sách users.

---

## 🚀 Truy cập Dashboard

### Cách 1: Từ Navigation Menu
1. Mở ứng dụng tại `http://localhost:4200`
2. Click vào **👨‍💼 Admin** trên thanh navigation
3. Bạn sẽ được chuyển đến Admin Dashboard

### Cách 2: Truy cập trực tiếp
- Mở trình duyệt và truy cập: `http://localhost:4200/admin`

---

## 📊 Giao diện tổng quan

### 1. **Statistics Cards** (Thẻ thống kê)
Ở phía trên cùng, bạn sẽ thấy 4 thẻ thống kê:

| Card | Ý nghĩa |
|------|---------|
| **👥 Total Users** | Tổng số users trong hệ thống |
| **✅ Active** | Số users đang hoạt động |
| **⏳ Pending** | Số users đang chờ duyệt |
| **🚫 Suspended** | Số users bị tạm ngưng |

**Lưu ý**: Các số liệu này tự động cập nhật khi bạn thực hiện thao tác.

### 2. **Search & Filters** (Tìm kiếm & Bộ lọc)
- **Search Bar**: Ô tìm kiếm lớn với icon 🔍
- **Filter Dropdowns**: 3 dropdown để lọc theo Role, Status, Department
- **Reset Button**: Nút 🔄 Reset để xóa tất cả filters
- **Filter Chips**: Hiển thị các filter đang active (có thể remove từng cái)

### 3. **Table Controls** (Điều khiển bảng)
- **Selection Info**: Hiển thị số lượng rows đã chọn
- **Bulk Actions**: Các nút thao tác hàng loạt (Delete, Email, Update Status)
- **Sort Controls**: Dropdown chọn field và nút toggle direction
- **Export Button**: Nút 📊 Export CSV

### 4. **Data Table** (Bảng dữ liệu)
Bảng hiển thị users với các cột:
- ☑️ Checkbox (chọn row)
- Name (Tên)
- Email
- Role (Vai trò)
- Status (Trạng thái)
- Department (Phòng ban)
- Joined (Ngày tham gia)
- Last Active (Hoạt động lần cuối)
- Tasks (Số task hoàn thành)

### 5. **Pagination** (Phân trang)
- **Info**: "Showing X to Y of Z users"
- **Page Numbers**: Các số trang để nhảy nhanh
- **Prev/Next**: Nút chuyển trang
- **Page Size**: Dropdown chọn số items/page

---

## 🔍 Tìm kiếm Users

### Tìm kiếm cơ bản

1. **Nhập từ khóa** vào ô search (icon 🔍)
   - Tìm theo **Name**: Ví dụ "John", "Sarah"
   - Tìm theo **Email**: Ví dụ "john.doe", "@company.com"

2. **Kết quả tự động hiển thị** ngay khi bạn gõ

3. **Xóa search**:
   - Click nút **✕** bên phải ô search
   - Hoặc click **🔄 Reset**

### Ví dụ tìm kiếm:

```
Tìm "john" → Hiển thị: John Doe, John Smith
Tìm "@gmail" → Hiển thị tất cả users có email Gmail
Tìm "dev" → Hiển thị users có "dev" trong name hoặc email
```

**💡 Mẹo**: Tìm kiếm không phân biệt chữ hoa/thường

---

## 🎯 Lọc Users (Filters)

### 1. **Filter by Role** (Lọc theo vai trò)

**Cách sử dụng:**
- Click dropdown **All Roles**
- Chọn vai trò muốn xem

**Các vai trò có sẵn:**
- **All Roles**: Hiển thị tất cả
- **Admin**: Quản trị viên
- **Manager**: Quản lý
- **Developer**: Lập trình viên
- **Designer**: Thiết kế
- **Viewer**: Người xem

**Ví dụ:**
```
Chọn "Developer" → Chỉ hiển thị developers
Chọn "Admin" → Chỉ hiển thị admins
```

### 2. **Filter by Status** (Lọc theo trạng thái)

**Cách sử dụng:**
- Click dropdown **All Statuses**
- Chọn trạng thái muốn xem

**Các trạng thái:**
- **All Statuses**: Hiển thị tất cả
- **Active**: Đang hoạt động
- **Inactive**: Không hoạt động
- **Pending**: Chờ duyệt
- **Suspended**: Bị tạm ngưng

**Ví dụ:**
```
Chọn "Active" → Chỉ hiển thị users đang active
Chọn "Pending" → Chỉ hiển thị users chờ duyệt
```

### 3. **Filter by Department** (Lọc theo phòng ban)

**Cách sử dụng:**
- Click dropdown **All Departments**
- Chọn phòng ban muốn xem

**Các phòng ban:**
- All Departments
- Engineering
- Product
- Design
- Marketing
- HR
- Sales

**Ví dụ:**
```
Chọn "Engineering" → Chỉ hiển thị users trong Engineering
Chọn "Design" → Chỉ hiển thị designers
```

### 4. **Kết hợp nhiều Filters**

Bạn có thể kết hợp nhiều filters cùng lúc:

**Ví dụ:**
```
Role: Developer
Status: Active
Department: Engineering
→ Hiển thị: Active developers trong Engineering
```

### 5. **Filter Chips** (Thẻ lọc)

Khi bạn apply filters, sẽ xuất hiện các chips hiển thị filters đang active:

```
Active Filters: [Role: Developer] [Status: Active] [Department: Engineering]
```

**Remove filter:**
- Click nút **✕** trên chip để remove filter đó
- Hoặc click **🔄 Reset** để xóa tất cả

---

## 📊 Sắp xếp (Sort)

### Cách sử dụng Sort

1. **Chọn field để sort**:
   - Click dropdown "Sort: Name"
   - Chọn field muốn sort

2. **Toggle direction**:
   - Click nút **⬆️** (Ascending) hoặc **⬇️** (Descending)
   - Nút tự động toggle khi click

### Các field có thể sort:

| Field | Mô tả | Khi nào dùng |
|-------|-------|--------------|
| **Name** | Sắp xếp theo tên | Tìm user theo alphabet |
| **Email** | Sắp xếp theo email | Tìm theo domain |
| **Role** | Sắp xếp theo vai trò | Group theo role |
| **Status** | Sắp xếp theo trạng thái | Group theo status |
| **Joined Date** | Sắp xếp theo ngày tham gia | Tìm user mới/cũ nhất |
| **Last Active** | Sắp xếp theo lần active cuối | Tìm user inactive |
| **Tasks** | Sắp xếp theo số task | Tìm top performers |

### Ví dụ Sort:

```
Sort: Name ⬆️ → A-Z (Alice, Bob, Charlie)
Sort: Name ⬇️ → Z-A (Zack, Yuki, Xavier)

Sort: Joined Date ⬇️ → Mới nhất lên đầu
Sort: Last Active ⬇️ → Active gần đây nhất lên đầu
Sort: Tasks ⬇️ → Nhiều task nhất lên đầu
```

---

## ✅ Chọn Users (Row Selection)

### 1. **Chọn single user**

**Cách làm:**
- Click checkbox ở đầu row muốn chọn
- Row sẽ được highlight màu xanh nhạt
- Click lại để bỏ chọn

### 2. **Select All** (Chọn tất cả)

**Cách làm:**
- Click checkbox ở header của table
- Tất cả users **trên trang hiện tại** sẽ được chọn

**Lưu ý**: 
- Chỉ chọn users trên trang hiện tại (visible rows)
- Không chọn users ở các trang khác

### 3. **Deselect All** (Bỏ chọn tất cả)

**Cách làm:**
- Click lại checkbox ở header (khi đã select all)
- Hoặc click nút **Clear** trong selection info

### 4. **Selection Info**

Khi có users được chọn, sẽ hiển thị:

```
[3 selected] [Clear]
```

- **Số lượng**: Hiển thị số users đã chọn
- **Clear**: Nút để bỏ chọn tất cả

---

## 🎯 Bulk Actions (Thao tác hàng loạt)

Khi đã chọn ít nhất 1 user, các nút bulk actions sẽ xuất hiện:

### 1. **🗑️ Delete** (Xóa hàng loạt)

**Cách sử dụng:**
1. Chọn users muốn xóa (checkboxes)
2. Click nút **🗑️ Delete**
3. Confirm trong dialog
4. Users sẽ bị xóa khỏi hệ thống

**Cảnh báo**: Thao tác này không thể hoàn tác!

**Ví dụ:**
```
Chọn 3 users → Click Delete → Confirm
→ 3 users bị xóa
→ Selection tự động clear
```

### 2. **📧 Email** (Gửi email hàng loạt)

**Cách sử dụng:**
1. Chọn users muốn gửi email
2. Click nút **📧 Email**
3. Dialog sẽ hiển thị số lượng users

**Lưu ý**: Tính năng này chưa được implement đầy đủ (placeholder)

### 3. **🔄 Update Status** (Cập nhật trạng thái)

**Cách sử dụng:**
1. Chọn users muốn update
2. Click nút **🔄 Update Status ▼**
3. Dropdown menu sẽ hiển thị
4. Chọn status mới:
   - Active
   - Inactive
   - Pending
   - Suspended
5. Status của tất cả users đã chọn sẽ được update

**Ví dụ:**
```
Chọn 5 Pending users → Update Status → Active
→ 5 users chuyển sang Active
→ Selection tự động clear
```

---

## 📊 Export CSV

### Export Selected Users

**Cách làm:**
1. Chọn users muốn export (checkboxes)
2. Click nút **📊 Export CSV**
3. File CSV sẽ tự động download

**File name format**: `users-export-YYYY-MM-DD.csv`

### Export All Filtered Users

**Cách làm:**
1. **Không chọn** bất kỳ user nào
2. Apply filters nếu muốn (optional)
3. Click nút **📊 Export CSV**
4. Tất cả users sau khi filter sẽ được export

**Smart behavior:**
- Có selection → Export selected
- Không có selection → Export filtered
- Không có filter → Export tất cả

### CSV Format

File CSV bao gồm các cột:
```
ID, Name, Email, Role, Status, Department, Joined Date, Last Active, Tasks Completed
```

**Ví dụ:**
```csv
1,John Doe,john.doe@company.com,Admin,Active,Engineering,2022-01-15,2024-12-15,245
2,Jane Smith,jane.smith@company.com,Manager,Active,Product,2021-06-20,2024-12-14,189
```

---

## 📄 Phân trang (Pagination)

### 1. **Pagination Info**

Hiển thị thông tin:
```
Showing 1 to 10 of 15 users
```

- **1 to 10**: Users đang hiển thị
- **of 15**: Tổng số users (sau khi filter)

### 2. **Page Navigation**

**Prev/Next Buttons:**
- **← Prev**: Về trang trước
- **Next →**: Sang trang sau
- Disabled khi ở trang đầu/cuối

**Page Numbers:**
- Click số trang để nhảy trực tiếp
- Trang hiện tại được highlight
- Hiển thị tối đa 7 số trang

**Ví dụ:**
```
[← Prev] [1] [2] [3] [4] [5] [Next →]
         ^^^
      (trang hiện tại)
```

### 3. **Page Size**

**Cách thay đổi:**
- Click dropdown "10 per page"
- Chọn số items muốn hiển thị:
  - 5 per page
  - 10 per page (default)
  - 20 per page
  - 50 per page

**Lưu ý**: Khi thay đổi page size, sẽ tự động reset về trang 1

---

## 🎨 Hiểu các Badge & Icons

### Role Badges (Màu vai trò)

| Badge | Màu | Ý nghĩa |
|-------|-----|---------|
| **ADMIN** | Vàng | Quản trị viên |
| **MANAGER** | Xanh dương | Quản lý |
| **DEVELOPER** | Xanh lá | Lập trình viên |
| **DESIGNER** | Hồng | Thiết kế |
| **VIEWER** | Xám | Người xem |

### Status Badges (Màu trạng thái)

| Badge | Màu | Ý nghĩa |
|-------|-----|---------|
| **ACTIVE** | Xanh lá | Đang hoạt động |
| **INACTIVE** | Xám | Không hoạt động |
| **PENDING** | Vàng | Chờ duyệt |
| **SUSPENDED** | Đỏ | Bị tạm ngưng |

### User Avatar

- Hình tròn với **chữ cái đầu** của tên
- Màu gradient tím-xanh
- Giúp nhận diện nhanh user

### Last Active

Hiển thị thời gian relative:
- **Today**: Hôm nay
- **Yesterday**: Hôm qua
- **3 days ago**: 3 ngày trước
- **2 weeks ago**: 2 tuần trước
- **1 month ago**: 1 tháng trước

---

## 🎯 Các tình huống sử dụng thực tế

### Tình huống 1: Tìm tất cả Developers đang Active

**Bước 1**: Click dropdown **All Roles** → Chọn **Developer**

**Bước 2**: Click dropdown **All Statuses** → Chọn **Active**

**Kết quả**: Danh sách tất cả active developers

**Bonus**: Sort by **Tasks ⬇️** để xem top performers

---

### Tình huống 2: Xóa tất cả Pending users

**Bước 1**: Click dropdown **All Statuses** → Chọn **Pending**

**Bước 2**: Click checkbox ở header để **Select All**

**Bước 3**: Click nút **🗑️ Delete**

**Bước 4**: Confirm trong dialog

**Kết quả**: Tất cả pending users bị xóa

---

### Tình huống 3: Export danh sách Engineering team

**Bước 1**: Click dropdown **All Departments** → Chọn **Engineering**

**Bước 2**: **Không chọn** bất kỳ user nào

**Bước 3**: Click nút **📊 Export CSV**

**Kết quả**: File CSV chứa tất cả Engineering users

---

### Tình huống 4: Tìm users không active gần đây

**Bước 1**: Click dropdown **Sort: Name** → Chọn **Last Active**

**Bước 2**: Click nút direction → **⬆️** (Ascending)

**Kết quả**: Users lâu không active nhất lên đầu

**Bonus**: Filter by **Status: Inactive** để chỉ xem inactive users

---

### Tình huống 5: Approve tất cả Pending users trong Design

**Bước 1**: 
- Filter **Department: Design**
- Filter **Status: Pending**

**Bước 2**: Click checkbox header để **Select All**

**Bước 3**: Click **🔄 Update Status ▼** → Chọn **Active**

**Kết quả**: Tất cả pending designers chuyển sang active

---

## 💡 Tips & Tricks

### 1. **Tìm kiếm nhanh**
```
Gõ vài ký tự đầu → Kết quả hiện ngay
Ví dụ: "joh" → John Doe, John Smith
```

### 2. **Combo Filter mạnh**
```
Role: Developer
Status: Active
Department: Engineering
Sort: Tasks ⬇️
→ Top performing active developers
```

### 3. **Export thông minh**
```
Muốn export một vài users → Chọn rồi export
Muốn export filtered list → Không chọn, export luôn
```

### 4. **Clear selection nhanh**
```
Thay vì uncheck từng cái → Click "Clear" button
```

### 5. **Reset về trạng thái ban đầu**
```
Click 🔄 Reset → Xóa search, filters, về trang 1
```

---

## 🐛 Xử lý sự cố

### Không tìm thấy user?

**Nguyên nhân có thể:**
1. Filters quá strict
2. Sai chính tả trong search
3. User đã bị xóa

**Giải pháp:**
- Click **🔄 Reset** để xóa tất cả filters
- Kiểm tra lại search query
- Thử search theo email thay vì name

### Table trống?

**Kiểm tra:**
1. Có thông báo "No users found" không?
2. Filter chips có hiển thị không?
3. Search bar có text không?

**Giải pháp:**
- Remove filter chips (click ✕)
- Clear search (click ✕)
- Click **🔄 Reset**

### Bulk actions không hoạt động?

**Kiểm tra:**
1. Đã chọn ít nhất 1 user chưa?
2. Bulk action buttons có hiển thị không?

**Giải pháp:**
- Chọn ít nhất 1 user bằng checkbox
- Bulk actions sẽ tự động xuất hiện

### Export CSV không download?

**Nguyên nhân:**
- Browser block popup/download
- Không có data để export

**Giải pháp:**
- Allow downloads trong browser settings
- Kiểm tra có users nào được chọn/filtered không

---

## 📊 Thống kê Dashboard

### Tổng quan dữ liệu mẫu:

- **Tổng số users**: 15 users
- **Roles**: 5 roles (Admin, Manager, Developer, Designer, Viewer)
- **Statuses**: 4 statuses (Active, Inactive, Pending, Suspended)
- **Departments**: 7 departments

### Phân bố theo Status:

- **Active**: ~60% (9 users)
- **Inactive**: ~13% (2 users)
- **Pending**: ~13% (2 users)
- **Suspended**: ~7% (1 user)

### Phân bố theo Role:

- **Developer**: ~40% (6 users)
- **Manager**: ~27% (4 users)
- **Designer**: ~20% (3 users)
- **Admin**: ~7% (1 user)
- **Viewer**: ~13% (2 users)

---

## 🎓 Kết luận

Admin Dashboard là công cụ mạnh mẽ để:
- ✅ Quản lý users hiệu quả
- ✅ Tìm kiếm và lọc nhanh chóng
- ✅ Thực hiện bulk actions
- ✅ Export data dễ dàng
- ✅ Theo dõi statistics real-time

**Hãy thử ngay!** 👥

---

## 📞 Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi:
1. Đọc lại phần "Xử lý sự cố"
2. Thử **🔄 Reset** để về trạng thái ban đầu
3. Refresh trang (F5)
4. Liên hệ support team

---

**Chúc bạn quản lý users hiệu quả! 👥✨**
