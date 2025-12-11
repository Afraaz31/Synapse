import Student from "../models/student.model.js"
import Result from "../models/result.model.js"
const renderHome = (req, res) => {
    res.render('home.ejs')
}

const renderAcademic = (req, res) => {
    res.render("nav/academic.ejs")
}

const renderAbout = (req, res) => {
    res.render("nav/about.ejs")
}
const FindStudent = async (req, res) => {
    try {
        const { usn } = req.params;

        if (!req.user) {
            req.flash('error', 'You must be logged in.');
            return res.redirect('/login'); 
        }

        
        if (req.user.usn.toString() !== usn.toString()) {
            req.flash('error', 'Unauthorized access.');
            return res.redirect('/');
        }

      
        const student = await Student.findOne({ usn: usn });

        
        if (!student) {
            req.flash('error', 'Student not found.');
            return res.redirect('/');
        }

        
        const result = await Result.findOne({ student: student._id }).sort({ createdAt: -1 });

        if (!result) {
            req.flash('error', 'No results found for this student.');
            return res.render('student/StudentInfo.ejs', { student, result: null });
        }

        res.render('student/StudentInfo.ejs', { student, result });

    } catch (e) {
        console.error("Error in FindStudent:", e);
        req.flash('error', 'Something went wrong fetching the data.');
        res.redirect('/');
    }
}

const navController = {
    renderHome,
    renderAcademic,
    renderAbout,
    FindStudent
}

export default navController;