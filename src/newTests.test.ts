import * as db from "./transcriptManager";

//student already has grade in course
//course exists in transcript
//get grade that doesn't exist
//
/*
Tests for the Transcript Manager. 
 */
describe('Start', () => {
  it('should start with transcripts as empty', () => {
    expect(db.getAll()).toEqual([]);
  });
})

describe('TranscriptManager', () => {
  beforeEach(() => {
    // Before any test runs, clean up the datastore. This should ensure that tests are hermetic.
    db.initialize();
  })

  describe('Initialize', () => {
    it('should set allTranscripts to empty', () => {
      db.initialize()
      expect(db.getAll()).toEqual([]);
    });
  })
  describe('Create student', () => {
    it('should return an ID, starting with 1', () => {
      const ret = db.addStudent('avery');
      expect(ret).toEqual(1);
      expect(db.getTranscript(ret)?.grades).toEqual([]);
    });
  })
  describe('Get transcript', () => {
    it('should return an empty transcript upon student creation', () => {
      const ret = db.addStudent('avery');
      expect(db.getTranscript(ret)?.grades).toEqual([]);
    });
    it('should return the correct transcript with grades', () => {
      const ret = db.addStudent('avery');
      db.addGrade(ret, 'test course', 100);
      expect(db.getTranscript(ret)?.grades).toEqual(expect.arrayContaining([{"course": "test course", "grade": 100}]));
      const ret2 = db.addStudent('jeff');
      db.addGrade(ret2, 'test course 2', 50);
      expect(db.getTranscript(ret2)?.grades).toEqual(expect.arrayContaining([{"course": "test course 2", "grade": 50}]));
    });
  })
  describe('Get all', () => {
    it('should return an empty transcript array', () => {
      expect(db.getAll()).toEqual([]);
    });
  })
  describe('Adding grades/getting grades', () => {
    it('should add the grade to the transcript', () => {
      const studentID = db.addStudent('test student');
      db.addGrade(studentID, 'test course', 100);
      const grade = db.getGrade(studentID, 'test course');
      expect(grade).toBe(100);
      expect(()=>db.addGrade(studentID, 'test course', 50)).toThrow(`student ${studentID} already has a grade in course test course`);
    })
    it('should get the correct grade', () => {
      const studentID = db.addStudent('test student');
      const studentID2 = db.addStudent('test student 2');
      db.addGrade(studentID, 'test course', 100);
      db.addGrade(studentID2, 'test course 2', 50);
      db.addGrade(studentID2, 'test course 3', 60);
      expect(db.getGrade(studentID, 'test course')).toBe(100);
      expect(db.getGrade(studentID2, 'test course 2')).toBe(50);
      expect(db.getGrade(studentID2, 'test course 3')).toBe(60);
    })
    it('Should throw an error if the student ID is invalid', () =>{
      expect(() => db.addGrade(1, 'test course', 100)).toThrow(`no student with ID = 1`);
    });
    it('Should throw an error if the course is invalid', () =>{
      expect(() => db.getGrade(1, 'test course 2')).toThrow(`no grade for student 1 in course test course 2`);
    });
  })
  describe('getStudentIDs', () => {
    it('Should return only the students who match the name', () => {
      const avery1 = db.addStudent('avery');
      const avery2 = db.addStudent('avery');
      const ripley = db.addStudent('ripley');

      //Probably should be checking if arrays contain same set of IDs, permitting different orders...
      //Checks array content, ignoring order
      const avery_id = db.getStudentIDs('avery');
      expect(avery_id.length).toEqual(2);
      expect(avery_id).toContain(avery1);
      expect(avery_id).toContain(avery2);
      expect(db.getStudentIDs('ripley')).toEqual([ripley]);
    })
  });
  describe('Deleting students', () => {
    it('Should result in the students\' transcript no longer being available', () => {
      const studentID = db.addStudent('test student');
      const studentID2 = db.addStudent('test student');
      db.deleteStudent(studentID2);
      expect(db.getTranscript(studentID2)).toBeUndefined();
    })
    it('Should throw an error if the ID is invalid', ()=>{
      expect(()=>db.deleteStudent(10)).toThrow(`no student with ID = 10`);
    })
  })
});
