import NoteModel from "../../db/models/Note.model.js";
import UserModel from "../../db/models/User.model.js";

export const createNote = async (req, res, next) => {
    try {
        const userId = res.userId
        const userName = res.UserName
        const { title, content } = req.body
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const note = await NoteModel.create({ title, content, userId: user._id })

        // Get total notes count after creating new note
        const totalNotes = await NoteModel.countDocuments({ userId })

        res.status(201).json({
            data: {
                message: 'Note created successfully',
                note,
                createdBy: userName,
                userId: userId,
                totalNotes: totalNotes,
                messageWithCount: `Note created successfully. You now have ${totalNotes} total notes.`
            }
        })


    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })

    }

}
export const updateNote = async (req, res, next) => {
    try {
        const userId = res.userId
        const noteId = req.params.id
        const { title, content } = req.body

        const note = await NoteModel.findById(noteId)
        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }
        if (note.userId.toString() !== userId) {
            return res.status(404).json({ message: 'You are not the owner of this note' })
        }
        const updatedNote = await NoteModel.findByIdAndUpdate(noteId, { title, content }, { new: true })
        res.status(200).json({ data: { message: 'Note updated successfully', updatedNote, updatedBy: res.UserName, userId: userId } })

    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }


}

export const updateAllNotes = async (req, res, next) => {
    try {
        const userId = res.userId
        const userName = res.UserName
        const { title } = req.body
        const notes = await NoteModel.find({ userId })
        if (notes.length === 0) {
            return res.status(404).json({ data: { message: 'No notes found', } })
        }
        if (title.trim() === "") {
            return res.status(400).json({ data: { message: 'Title is required' } })
        }


        const updatedNotes = await NoteModel.updateMany({ userId }, { title })
        res.status(200).json({ data: { message: 'All  Notes updated successfully', updatedNotes, updatedBy: userName, userId: userId } })

    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }

}



export const deleteNote = async (req, res, next) => {
    try {
        const userId = res.userId
        const noteId = req.params.id
        const userName = res.UserName

        const note = await NoteModel.findById(noteId)
        if (!note) {
            return res.status(404).json({ message: 'Note not found' })
        }
        if (note.userId.toString() !== userId) {
            return res.status(404).json({ message: 'You are not the owner of this note' })
        }
        const deletedNote = await NoteModel.findByIdAndDelete(noteId)

        // Get remaining notes count after deletion
        const remainingNotes = await NoteModel.countDocuments({ userId })

        res.status(200).json({
            data: {
                message: 'Note deleted successfully',
                deletedNote,
                deletedBy: userName,
                userId: userId,
                noteDeleted: deletedNote,
                remainingNotes: remainingNotes,
                messageWithCount: `Note deleted successfully. You now have ${remainingNotes} notes remaining.`
            }
        })

    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }


}



export const paginateSort = async (req, res, next) => {
    try {
        const userId = res.userId
        const userName = res.UserName
        const { page, limit } = req.query
        const note = await NoteModel.find({ userId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        if (note.length === 0) {
            return res.status(404).json({ data: { message: "No notes found" } })
        }

        // Get total count of all notes for this user
        const totalNotesCount = await NoteModel.countDocuments({ userId })

        res.status(200).json({
            data: {
                message: "Notes fetched successfully",
                notes: note,
                page,
                limit,
                userName,
                userId,
                currentPageNotes: note.length,
                totalNotes: totalNotesCount,
                paginationInfo: `Showing ${note.length} notes from page ${page} (${totalNotesCount} total notes)`
            }
        })
    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }
}

export const noteById = async (req, res, next) => {
    try {
        const userId = res.userId
        const noteId = req.params.id
        const userName = res.UserName
        const note = await NoteModel.findById(noteId)
        if (!note) {
            return res.status(404).json({ data: { message: "Note not found" } })
        }
        if (note.userId.toString() !== userId) {
            return res.status(404).json({ data: { message: "You are not the owner of this note" } })
        }
        res.status(200).json({ data: { message: "Note fetched successfully", note, userName, userId } })
    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }


}


export const noteByContent = async (req, res, next) => {
    try {
        const userId = res.userId
        const userName = res.UserName
        const { content } = req.query
        const note = await NoteModel.find({ userId, content })
        if (note.length === 0) {
            return res.status(404).json({ data: { message: "No notes found" } })
        }
        res.status(200).json({ data: { message: "Note fetched successfully", note, userName, userId, noteNumbers: note.length } })
    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }


}




export const noteWithUser = async (req, res, next) => {
    try {
        const userId = res.userId
        const userName = res.UserName
        const email = req.user.email
        const note = await NoteModel.find({ userId }).select('title userId createdAt')
        const user = await UserModel.find({ _id: userId }).select(email)
        if (!note) {
            return res.status(404).json({ data: { message: "No notes found" } })
        }
        if (!user) {
            return res.status(404).json({ data: { message: "User not found" } })
        }
        res.status(200).json({
            data: {
                message: "Note fetched successfully",
                note,
                userName,
                userId,
                email,
                totalNotes: note.length,
                notesCount: `User has ${note.length} notes total`
            }
        })

    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }
}




export const noteWithUserAndSearch = async (req, res, next) => {
    try {
        const userId = res.userId
        const userName = res.UserName
        const email = req.user.email
        const { title } = req.query

        // Get total notes count for this user
        const totalNotesCount = await NoteModel.countDocuments({ userId })

        const note = await NoteModel.aggregate([
            { $match: { userId } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $match: { 'user.email': email } },
            { $project: { title: 1, userId: 1, createdAt: 1, 'user.name': 1, 'user.email': 1 } }
        ])

        res.status(200).json({
            data: {
                message: "Note fetched successfully",
                userName,
                userId,
                email,
                searchResults: note.length,
                totalNotes: totalNotesCount,
                note
            }
        })

    } catch (error) {
        res.status(500).json({ data: { message: 'Internal server error', error: error.message } })
    }
}


//DELETE /notes
export const deleteAllNotes = async (req, res, next) => {
    try {
        const userId = res.userId
        const userName = res.UserName
        const note = await NoteModel.find({ userId })
        if (note.length === 0) {
            return res.status(404).json({ data: { message: "No notes found" } })
        }
        const deletedNotes = await NoteModel.deleteMany({ userId })
        res.status(200).json({ data: { message: "All notes deleted successfully", userName, userId, deletedNotes } })

    } catch (error) {
        res.status(500).json({ data: { message: "Internal server error", error: error.message } })
    }
}
 