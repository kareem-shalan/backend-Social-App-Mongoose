import { Router } from "express";
import authenticate from "../../db/middleware/user.middleware.js";
import * as  noteService from "./note.service.js";
const router = Router()
router.post('/create', authenticate, noteService.createNote)
router.put('/update/:id', authenticate, noteService.updateNote)
router.patch('/updateAll', authenticate, noteService.updateAllNotes)
router.delete('/delete/:id', authenticate, noteService.deleteNote)
router.get('/paginate-sort', authenticate, noteService.paginateSort)
router.get('/noteById/:id', authenticate, noteService.noteById)
router.get('/noteByContent', authenticate, noteService.noteByContent)
router.get('/noteWithUser', authenticate, noteService.noteWithUser)
router.get('/noteWithUserAndSearch', authenticate, noteService.noteWithUserAndSearch)
router.delete('/deleteAll', authenticate, noteService.deleteAllNotes)
export default router