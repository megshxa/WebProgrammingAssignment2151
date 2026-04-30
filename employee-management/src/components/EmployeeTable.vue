<script setup>
const props = defineProps({
  employees: Array,
  loading: Boolean,
})

const emit = defineEmits(['edit', 'delete'])

const DEPT_COLORS = {
  IT: 'primary',
  HR: 'success',
  Finance: 'warning',
  Marketing: 'info',
  Operations: 'secondary',
  Sales: 'danger',
  Engineering: 'dark',
}

function deptColor(dept) {
  return DEPT_COLORS[dept] ?? 'secondary'
}

function formatSalary(val) {
  return Number(val).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
}
</script>

<template>
  <div class="card mt-4">
    <div class="card-body p-0">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2 mb-0">Fetching employees...</p>
      </div>

      <div v-else-if="employees.length === 0" class="text-center py-5">
        <i class="fs-1 text-muted">&#128100;</i>
        <p class="text-muted mt-2">No employees found. Add one to get started.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Designation</th>
              <th scope="col">Department</th>
              <th scope="col">Salary</th>
              <th scope="col" class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(emp, index) in employees" :key="emp.id">
              <td class="text-muted">{{ index + 1 }}</td>
              <td><code class="text-secondary">{{ emp.id }}</code></td>
              <td class="fw-semibold">{{ emp.name }}</td>
              <td>{{ emp.designation }}</td>
              <td>
                <span :class="`badge bg-${deptColor(emp.department)} badge-dept`">
                  {{ emp.department }}
                </span>
              </td>
              <td class="salary-cell">{{ formatSalary(emp.salary) }}</td>
              <td class="text-center action-btns">
                <button
                  class="btn btn-outline-primary btn-sm me-1"
                  @click="emit('edit', emp)"
                  title="Edit"
                >
                  &#9998; Edit
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="emit('delete', emp.id)"
                  title="Delete"
                >
                  &#128465; Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
