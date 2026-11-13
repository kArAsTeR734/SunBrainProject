import pool from '../../db.js';

export default class TopicModel {

  static async getTopicsBySubject(subjectId) {
    const query = `
    SELECT 
      t.id,
      c.label AS number,
      t.name
    FROM catalog_topics c
    JOIN topics t ON t.id = c.topic_id
    WHERE c.subject_code = $1
    ORDER BY c.position;
  `;

    const {rows} = await pool.query(query, [subjectId]);
    return rows;
  }

  // static async getTopicsByHomeworkId(homeworkId) {
  //   const query = `
  //   SELECT
  //     id,
  //     number,
  //     name,
  //     subject_code
  //   FROM topics
  //   JOIN
  //   WHERE subject_code = $1
  //   ORDER BY number;
  // `;
  // }

}
