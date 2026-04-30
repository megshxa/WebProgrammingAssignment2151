<script setup>
import { ref, computed, onMounted } from 'vue'
import EmployeeTable from './components/EmployeeTable.vue'
import EmployeeModal from './components/EmployeeModal.vue'
import * as api from './services/employeeApi.js'

const employees = ref([])
const loading = ref(false)
const showModal = ref(false)
const editingEmployee = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })
const searchQuery = ref('')

const filtered = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return employees.value
  return employees.value.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q),
  )
})

const stats = computed(() => ({
  total: employees.value.length,
  departments: new Set(employees.value.map((e) => e.department)).size,
  avgSalary: employees.value.length
    ? Math.round(employees.value.reduce((s, e) => s + Number(e.salary), 0) / employees.value.length)
    : 0,
}))

async function fetchEmployees() {
  loading.value = true
  try {
    const res = await api.getAll()
    employees.value = res.data
  } catch {
    showToast('Failed to load employees. Check your MockAPI URL.', 'danger')
  } finally {
    loading.value = false
  }
}

function openAdd() {
  editingEmployee.value = null
  showModal.value = true
}

function openEdit(emp) {
  editingEmployee.value = emp
  showModal.value = true
}

async function saveEmployee(formData) {
  try {
    if (editingEmployee.value) {
      await api.update(editingEmployee.value.id, formData)
      showToast('Employee updated successfully.')
    } else {
      await api.create(formData)
      showToast('Employee added successfully.')
    }
    showModal.value = false
    await fetchEmployees()
  } catch {
    showToast('Operation failed. Please try again.', 'danger')
  }
}

async function deleteEmployee(id) {
  if (!confirm('Are you sure you want to delete this employee?')) return
  try {
    await api.remove(id)
    showToast('Employee deleted.')
    await fetchEmployees()
  } catch {
    showToast('Delete failed. Please try again.', 'danger')
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => (toast.value.show = false), 3500)
}

onMounted(fetchEmployees)
</script>

<template>
  <!-- Navbar -->
  <nav class="navbar navbar-dark bg-primary shadow-sm">
    <div class="container">
      <span class="navbar-brand">
        &#128188; Employee Management System
      </span>
      <button class="btn btn-light btn-sm fw-semibold" @click="openAdd">
        &#43; Add Employee
      </button>
    </div>
  </nav>

  <div class="container py-4">
    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      :class="`alert alert-${toast.type} alert-dismissible d-flex align-items-center`"
      role="alert"
    >
      <span>{{ toast.message }}</span>
      <button type="button" class="btn-close ms-auto" @click="toast.show = false"></button>
    </div>

    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="stat-card bg-primary">
          <div class="fs-5 fw-semibold">Total Employees</div>
          <div class="fs-1 fw-bold">{{ stats.total }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card bg-success">
          <div class="fs-5 fw-semibold">Departments</div>
          <div class="fs-1 fw-bold">{{ stats.departments }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card bg-warning text-dark">
          <div class="fs-5 fw-semibold">Avg. Salary</div>
          <div class="fs-1 fw-bold">
            &#8377;{{ stats.avgSalary.toLocaleString('en-IN') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="row mb-2">
      <div class="col-md-5">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="&#128269; Search by name, designation or department..."
        />
      </div>
      <div class="col-md-7 d-flex align-items-center justify-content-end">
        <small class="text-muted">
          Showing {{ filtered.length }} of {{ employees.length }} employees
        </small>
      </div>
    </div>

    <!-- Employee Table -->
    <EmployeeTable
      :employees="filtered"
      :loading="loading"
      @edit="openEdit"
      @delete="deleteEmployee"
    />
  </div>

  <!-- Add / Edit Modal -->
  <EmployeeModal
    v-model:show="showModal"
    :employee="editingEmployee"
    @save="saveEmployee"
  />
</template>
