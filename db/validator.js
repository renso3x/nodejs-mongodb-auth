const mongoose = require('mongoose');

// connect
mongoose.connect('mongodb://localhost/mongo-excercises', {
  useNewUrlParser: true
})
  .then(() => console.log('You are now connected'))
  .catch(() => console.log('Error connecting in mongodb'));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: String,
  category: {
    type: String,
    enum: ['web', 'mobile']
  },
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: () => 'course must have atleast 1 tag'
    }
  },
  date: Date,
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function createMovie() {
  const course = new Course({
    name: 'React v1',
    category: '-',
    author: 'Romeo',
    tags: [],
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (err) {
    // Validation Error
    for (field in err.errors) {
      console.log(err.errors[field].message);
    };
  }
}

createMovie();