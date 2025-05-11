import express from 'express'
import dotenv from 'dotenv'
import { connectToMongoDB } from './connection.js';
import mongoose, { set } from 'mongoose';
import cors from 'cors';
import { Parser } from 'json2csv';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const PORT = process.env.PORT || 8000;
connectToMongoDB(process.env.MONGODB_URL);

const emptySchema = new mongoose.Schema({}, { strict: false });

export const employeeList = mongoose.model('TryCollection', emptySchema, 'TryCollection');


// app.get('/', async(req,res) => {
//   const data = await employeeList.find({});
//   console.log("data ",data);
//   res.send(data);
// });
function removeZeroSorts(sorting) {
  const cleaned = {};
  for (const key in sorting) {
    if (sorting[key] !== 0) {
      cleaned[key] = sorting[key];
    }
  }
  return cleaned;
}


async function setFilter(filter, sorting, searching) {

  const query = {};

  // gender
  if (filter.gender) {
    query.gender = filter.gender;
  }

  // isPermenant
  if (filter.isPermanent !== '') {
    switch (filter.isPermanent) {
      case 'true': query.isPermanent = true;
        break;
      case 'false': query.isPermanent = false;
        break;
      default: query.isPermanent = '';
        break;
    }
  }

  // yearOfExperience
  if (filter.yearOfExperience.start || filter.yearOfExperience.end) {
    query.yearOfExperience = {};
    if (filter.yearOfExperience.start !== '') {
      query.yearOfExperience.$gte = Number(filter.yearOfExperience.start);
    }
    if (filter.yearOfExperience.end !== '') {
      query.yearOfExperience.$lte = Number(filter.yearOfExperience.end);
    }
  }

  // salary
  if (filter.salary.start || filter.salary.end) {
    query.salary = {};
    if (filter.salary.start !== '') {
      query.salary.$gte = Number(filter.salary.start);
    }
    if (filter.salary.end !== '') {
      query.salary.$lte = Number(filter.salary.end);
    }
  }

  // 🔍 Use it in a find query

  if (searching.searchField && searching.searchText) {
    const searchField = searching.searchField;
    const searchText = searching.searchText
    console.log("searchField 333", searchField);
    console.log("searchText 333", searchText);
    const regEx = { $regex: searchText, $options: 'i' }
    if (searchField === 'all') {
      query.$or = [
        { name: regEx },
        { email: regEx },
        { locality: regEx }
      ];
    } else {
      query[searchField] = regEx;
    }
  }

  console.log("query ", query);
  const cleanedSorting = removeZeroSorts(sorting);

  const data = await employeeList.find(query).sort(cleanedSorting);
  return data;
}

async function fetchData(req, res) {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : null;
  const sorting = req.query.sorting ? JSON.parse(req.query.sorting) : null;
  const searching = req.query.searching ? JSON.parse(req.query.searching) : null;
  const pageNo = req.query.pageNo ? JSON.parse(req.query.pageNo) : null;
  const pageSize = req.query.pageSize ? JSON.parse(req.query.pageSize) : null;

  console.log("filter ", filter);
  console.log("sorting ", sorting);
  console.log("searching ", searching);
  console.log("pageNo ", pageNo);
  console.log("pageSize ", pageSize);

  let data;
  async function filteredData() {
    data = await setFilter(filter, sorting, searching);
    const totalPages = Math.ceil(data.length / pageSize);

    data = data.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    // console.log("data@@@ ", data.length);

    console.log("data222 ", data.length);
    res.send({
      records: data,
      totalPages: totalPages,
    });


  }
  filteredData();
}

app.get('/', fetchData)


app.put('/update', async (req, res) => {
  try {
    function setIsPermanent(value) {
      selectedCheckboxEmailList.forEach(async (email) => {
        await employeeList.updateOne(
          { email: email },  // replace with your actual field
          { $set: { isPermanent: value } }  // change to true or false
        );
      })
    }

    const { selectedCheckboxEmailList, value } = req.body;
    console.log('typeof value ', typeof value);
    value ? setIsPermanent(true) : setIsPermanent(false);
  } catch (error) {
    console.log("error ", error);
  }

  setTimeout(() => {
    fetchData(req, res);
  }, 1500)
})

app.delete('/delete', async (req, res) => {
  try {
    const { selectedCheckboxEmailList } = req.body;
    // console.log("selectedCheckboxEmailList ", selectedCheckboxEmailList);
    selectedCheckboxEmailList.forEach(async (email) => {
      await employeeList.deleteOne({ email: email });
    })
  } catch (error) {
    console.log("error ", error);
  }

  setTimeout(() => {
    fetchData(req, res);
  }, 2000)
})

// app.post('/downloadCSV', async () => {
//   const { selectedCheckboxEmailList } = req.body;
//   console.log("selectedCheckboxEmailList ", selectedCheckboxEmailList);
//   let data;
//   try {
//     data = await employeeList.find({ email: { $in: selectedCheckboxEmailList } })
//     console.log("data ", data);
//   } catch (error) {
//     console.log("error ", error);
//   }

//   try {
//     const parser = new Parser();
//     const csv = parser.parse(data);

//     res.header('Content-Type', 'text/csv');
//     res.attachment('data.csv');
//     res.send(csv);
//   } catch (err) {
//     res.status(500).send('Failed to convert data to CSV');
//   }
// })

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));