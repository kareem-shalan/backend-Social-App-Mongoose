import { model, Schema } from 'mongoose'

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: [3, 'Title must be at least 3 characters'],
        validate: {
            validator: (value) => {

                return value !== value.toUpperCase().trim();
            },
            message: 'Title cannot be entirely uppercase'
        }
    },
    content: { type: String, required: true, minlength: [10, 'Content must be at least 10 characters'] },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

})


const NoteModel = model("note", noteSchema)
export default NoteModel