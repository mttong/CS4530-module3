import * as db from "./transcriptManager";

/*
Tests for the Transcript Manager. But covering lines 76, 85 and 95 this time. 
 */
describe('TranscriptManagerNewTests', () => {

  beforeEach(() => {
    // Before any test runs, clean up the datastore. This should ensure that tests are hermetic.
    db.initialize();
  })

  describe('Adding grades', () => {
    it('should add the grade to the transcript', () => {
      const studentID = db.addStudent('test student');
      db.addGrade(studentID, 'test course', 100);
      const grade = db.getGrade(studentID, 'test course');
      expect(grade).toBe(100);

      //What our group added here - was to test that the function will throw an error if the student ID already has a grade 
      expect(() => db.addGrade(studentID, 'test course', 50)).toThrowError();
    })
    it('Should throw an error if the student ID is invalid', () =>{
      expect(() => db.addGrade(1, 'test course', 100)).toThrowError();
    });

    // What our group added here - was to test that the function will throw an error if the student is not in the course
    it('Should throw an error if the course is invalid', () =>{
        expect(() => db.getGrade(10, 'test course 2')).toThrowError();
    });

  })

  

});
