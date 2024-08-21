<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <fieldset>
        <legend>Version 0.1</legend>
        <p class="mb-5">
          <span>Swagger is</span>
          <a href="https://api.devhub.io.vn/swagger-ui.html" target="_blank">available here</a>.
        </p>
        <!-- Môn -->
        <div class="mb-3">
          <label for="SubjectSelect" class="form-label">Môn</label>
          <select id="SubjectSelect" class="form-select" v-model="selectedSubject" @change="updateExams">
            <option v-for="subject in subjects" :key="subject.subjectId" :value="subject.subjectId">
              {{ subject.subjectName }}
            </option>
          </select>
        </div>
        
        <!-- Kỳ thi -->
        <div class="mb-3" v-if="filteredExams.length">
          <label for="ExamSelect" class="form-label">Kỳ thi</label>
          <select id="ExamSelect" class="form-select" v-model="selectedExam" @change="updateQuestions">
            <option v-for="exam in filteredExams" :key="exam.examId" :value="exam.examId">
              {{ exam.examDate }}
            </option>
          </select>
        </div>

        <!-- Tìm kiếm câu hỏi -->
        <div class="mb-3">
          <label for="TextInput" class="form-label">Nhập để tìm kiếm câu hỏi</label>
          <input v-model="searchQuery" type="text" id="TextInput" class="form-control" placeholder="Nhập ở đây!">
        </div>
      </fieldset>
    </form>

    <div v-if="filteredQuestions.length">
      <h2>Đáp án:</h2>
      <ul>
        <li v-for="question in filteredQuestions" :key="question.questionId">
          {{ question.content }}
          <span v-if="isImage(question.correctOption)">
            <img 
              :src="question.correctOption" 
              alt="Correct Option" 
              class="img-thumbnail" 
              @click="openModal(question.correctOption)"
            >
          </span>
          <span v-else>
            <code>Đ/A: {{ question.correctOption }}</code>
          </span>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No results found.</p>
    </div>

    <!-- Modal for image zoom -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img :src="modalImageSrc" alt="Zoomed Image">
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-thumbnail {
  display: block;
  max-width: 100%;
  height: auto;
  cursor: pointer;
  margin-bottom: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow: hidden;
}

.modal-content img {
  max-width: 100%;
  max-height: 80vh;
}
</style>

<script>
export default {
  data() {
    return {
      subjects: [],
      exams: [],
      questions: [],
      filteredExams: [],
      selectedSubject: '',
      selectedExam: '',
      searchQuery: '',
      showModal: false,
      modalImageSrc: '',
      url_api: 'https://api.devhub.io.vn/api'
    };
  },
  computed: {
    filteredQuestions() {
      return this.questions.filter(question => 
        question.content.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        question.exam === this.selectedExam
      );
    }
  },
  methods: {
    updateExams() {
      this.filteredExams = this.exams.filter(exam => exam.subject === this.selectedSubject);
      this.selectedExam = '';
      this.updateQuestions();
    },
    updateQuestions() {},
    handleSubmit() {
      console.log('Form submitted');
    },
    isImage(src) {
      return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(src);
    },
    openModal(src) {
      this.modalImageSrc = src;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalImageSrc = '';
    }
  },
  async created() {
    try {
      const subjectsResponse = await fetch(this.url_api + '/subjects');
      const examsResponse = await fetch(this.url_api + '/exams');
      const questionsResponse = await fetch(this.url_api + '/questions');

      if (!subjectsResponse.ok || !examsResponse.ok || !questionsResponse.ok) {
        throw new Error('Error fetching data');
      }

      this.subjects = await subjectsResponse.json();
      this.exams = await examsResponse.json();
      this.questions = await questionsResponse.json();
      
      this.updateExams();
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }
};
</script>
