<script setup>
import { ref, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  show: Boolean,
  employee: Object, // null = add mode, object = edit mode
})

const emit = defineEmits(['save', 'update:show'])

const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Engineering']

const modalEl = ref(null)
let bsModal = null

const form = ref({ name: '', designation: '', department: '', salary: '' })
const errors = ref({})

onMounted(() => {
  bsModal = new Modal(modalEl.value, { backdrop: 'static' })
  modalEl.value.addEventListener('hidden.bs.modal', () => emit('update:show', false))
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      resetForm()
      bsModal.show()
    } else {
      bsModal.hide()
    }
  },
)

watch(
  () => props.employee,
  (emp) => {
    if (emp) {
      form.value = {
        name: emp.name,
        designation: emp.designation,
        department: emp.department,
        salary: emp.salary,
      }
    }
  },
)

function resetForm() {
  errors.value = {}
  if (props.employee) {
    form.value = {
      name: props.employee.name,
      designation: props.employee.designation,
      department: props.employee.department,
      salary: props.employee.salary,
    }
  } else {
    form.value = { name: '', designation: '', department: '', salary: '' }
  }
}

function validate() {
  const e = {}
  if (!form.value.name.trim()) e.name = 'Name is required.'
  if (!form.value.designation.trim()) e.designation = 'Designation is required.'
  if (!form.value.department) e.department = 'Department is required.'
  if (!form.value.salary || isNaN(form.value.salary) || Number(form.value.salary) <= 0)
    e.salary = 'Enter a valid salary.'
  errors.value = e
  return Object.keys(e).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('save', { ...form.value, salary: Number(form.value.salary) })
}
</script>

<template>
  <div class="modal fade" ref="modalEl" tabindex="-1" aria-labelledby="empModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="empModalLabel">
            {{ employee ? '&#9998; Edit Employee' : '&#43; Add New Employee' }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="emit('update:show', false)"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body p-4">
          <form @submit.prevent="handleSubmit" novalidate>
            <!-- Name -->
            <div class="mb-3">
              <label class="form-label">Full Name <span class="text-danger">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                placeholder="e.g. Priya Sharma"
              />
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <!-- Designation -->
            <div class="mb-3">
              <label class="form-label">Designation <span class="text-danger">*</span></label>
              <input
                v-model="form.designation"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.designation }"
                placeholder="e.g. Software Engineer"
              />
              <div class="invalid-feedback">{{ errors.designation }}</div>
            </div>

            <!-- Department -->
            <div class="mb-3">
              <label class="form-label">Department <span class="text-danger">*</span></label>
              <select
                v-model="form.department"
                class="form-select"
                :class="{ 'is-invalid': errors.department }"
              >
                <option value="">-- Select Department --</option>
                <option v-for="dept in DEPARTMENTS" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              <div class="invalid-feedback">{{ errors.department }}</div>
            </div>

            <!-- Salary -->
            <div class="mb-3">
              <label class="form-label">Salary (&#8377;) <span class="text-danger">*</span></label>
              <input
                v-model="form.salary"
                type="number"
                min="1"
                class="form-control"
                :class="{ 'is-invalid': errors.salary }"
                placeholder="e.g. 75000"
              />
              <div class="invalid-feedback">{{ errors.salary }}</div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('update:show', false)">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">
            {{ employee ? 'Update Employee' : 'Add Employee' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
