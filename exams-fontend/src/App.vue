<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <fieldset>
        <legend>Version 0.1</legend>
        <p class="mb-5">
                <span>Swagger is</span>
                <a href="https:api.devhub.io.vn/swagger-ui.html" target="_blank">available here</a>.
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
          {{ question.content }} <code>Đ/A: {{ question.correctOption }}</code>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subjects: [], // Danh sách môn học
      exams: [], // Danh sách kỳ thi
      questions: [], // Danh sách câu hỏi
      filteredExams: [], // Kỳ thi dựa trên môn học đã chọn
      selectedSubject: '', // Môn học đã chọn
      selectedExam: '', // Kỳ thi đã chọn
      searchQuery: '', // Từ khóa tìm kiếm
      url_api: 'https://api.devhub.io.vn/api'
    };
  },
  computed: {
    filteredQuestions() {
      // Lọc câu hỏi dựa trên từ khóa tìm kiếm và kỳ thi đã chọn
      return this.questions.filter(question => 
        question.content.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        question.exam === this.selectedExam
      );
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
      
      this.updateExams(); // Cập nhật danh sách kỳ thi dựa trên môn học đầu tiên
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  },
  methods: {
    updateExams() {
      // Cập nhật danh sách kỳ thi dựa trên môn học đã chọn
      this.filteredExams = this.exams.filter(exam => exam.subject === this.selectedSubject);
      this.selectedExam = ''; // Reset kỳ thi đã chọn
      this.updateQuestions(); // Cập nhật câu hỏi dựa trên kỳ thi mới
    },
    updateQuestions() {
      // Cập nhật danh sách câu hỏi dựa trên kỳ thi đã chọn
      // Không cần làm gì thêm ở đây vì câu hỏi được lọc trong computed property
    },
    handleSubmit() {
      console.log('Form submitted');
    }
  }
};
</script>
 