import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationError from './utils/handleValidationError.js';
import cors from 'cors';
import { register, login, getMe } from './controllers/UserControllers.js';
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags,
} from './controllers/PostController.js';

mongoose
  .connect(
    'mongodb+srv://ruzeldenf:wwwwww@cluster0.nb2xzuc.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => console.log('DB error', err));

const app = express();

//uploading images
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//USERS
app.get('/auth/me', checkAuth, getMe); //get information
app.post('/auth/login', loginValidation, handleValidationError, login); //login
app.post('/auth/register', registerValidation, handleValidationError, register); //authorization

//POSTS
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, create); //create post
app.get('/posts', getAll); //get all posts
app.get('/tags', getLastTags); //get all posts

app.get('/posts/:id', getOne); //get one post
app.delete('/posts/:id', checkAuth, postCreateValidation, remove); //remove
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationError, update); //update

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.listen(process.env.PORT || 4444, (err, res) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
