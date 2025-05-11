import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Filter from "./Filter";
import SearchBar from "./components/SearchBar";
import EmployeeTable from "./components/EmployeeTable";
import api from "./api";



function App() {
  const [employeeList, setEmployeeList] = useState([]);
  const [isFilterApplyClicked, setisFilterApplyClicked] = useState(false);
  const [selectedEmpCheckbox, setSelectedEmpCheckbox] = useState([]);
  const [filter, setFilter] = useState({
    gender: "",
    isPermanent: "",
    // skills: [],
    yearOfExperience: {
      start: "",
      end: "",
    },
    salary: {
      start: "",
      end: "",
    },
  });

  const [sorting, setSorting] = useState({
    name: 0,
    email: 0,
    locality: 0,
    skills: 0,
    yearOfExperience: 0,
    salary: 0,
    isPermanent: 0,
  })

  const [searching, setSearching] = useState({
    searchText: "",
    searchingField: "",
  });

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState();

  function getEncodedUrl() {
    const filterString = JSON.stringify(filter);
    const pageNoString = JSON.stringify(pageNo);
    const pageSizeString = JSON.stringify(pageSize);
    const sortingString = JSON.stringify(sorting);
    const searchingString = JSON.stringify(searching);

    const encodedFilter = encodeURIComponent(filterString);
    const encodedPageNo = encodeURIComponent(pageNoString);
    const encodedPageSize = encodeURIComponent(pageSizeString);
    const encodedSorting = encodeURIComponent(sortingString);
    const encodedSearching = encodeURIComponent(searchingString);

    const userReq = `filter=${encodedFilter}&pageNo=${encodedPageNo}&pageSize=${encodedPageSize}&sorting=${encodedSorting}&searching=${encodedSearching}`

    // console.log("userReq ", userReq);

    return userReq;
  }

  async function fetchData() {
    const userReq = getEncodedUrl();
    // console.log("userReq ", userReq);

    try {
      const data = await api.get(`/?${userReq}`);
      // console.log("frontend data ", data.data);
      setEmployeeList(data.data.records);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.log("error ", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // console.log('sorting ', sorting)
    // console.log('searching ', searching)
    // console.log('pageNo ', pageNo)
    // console.log('pageSize ', pageSize)
    fetchData();
  }, [searching, sorting, pageNo, pageSize]);

  useEffect(() => {
    console.log("isFilterChange ", isFilterApplyClicked);
    if (isFilterApplyClicked) {
      fetchData();
      setisFilterApplyClicked(false);
    }
  }, [isFilterApplyClicked]);

  function getVisibility() {
    if (selectedEmpCheckbox.length > 0) {
      return { visibility: "visible" }
    } else {
      return { visibility: "hidden" }
    }
  }

  async function handlePermanentAndTemparory(value) {
    const userReq = getEncodedUrl();

    const newData = await api.put(`/update?${userReq}`,{
      selectedCheckboxEmailList: selectedEmpCheckbox,
      value: value
    })
    setEmployeeList(newData.data.records);
    setTotalPages(newData.data.totalPages);
    setSelectedEmpCheckbox([]);
  }

  async function handleDeleteEmployee() {
    const userReq = getEncodedUrl();

    const newData = await api.delete(`/delete?${userReq}`, {
      data: {
        selectedCheckboxEmailList: selectedEmpCheckbox
      }
    })
    setEmployeeList(newData.data.records);
    setTotalPages(newData.data.totalPages);
    setSelectedEmpCheckbox([]);
  }

  // async function handleCSVDownload() {
  //   const userReq = getEncodedUrl();
  //   await api.put(`/downloadCSV?${userReq}`, {
  //     selectedCheckboxEmailList: selectedEmpCheckbox
  //   });

  //   const url = window.URL.createObjectURL(new Blob([newData.data]));
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', 'employees.csv');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }
  

  return (
    <>
      <h1 className="title">List of Employees</h1>
      {/* <hr/> */}
      <SearchBar searching={searching} setSearching={setSearching} />

      <Filter
        filter={filter}
        setFilter={setFilter}
        setisFilterApplyClicked={setisFilterApplyClicked}
        isFilterApplyClicked={isFilterApplyClicked}
      />

      <div className="button-container" style={getVisibility()}>
        <button className="btn delete" onClick={handleDeleteEmployee}>Delete</button>
        <button className="btn csv" onClick={handleCSVDownload}>Download CSV</button>
        <button className="btn permanent" onClick={() => handlePermanentAndTemparory(true)}>Mark as Permanent</button>
        <button className="btn temporary" onClick={() => handlePermanentAndTemparory(false)}>Mark as Temporary</button>
      </div>

      <EmployeeTable
        employees={employeeList}
        sorting={sorting}
        setSorting={setSorting}
        pageSize={pageSize}
        pageNo={pageNo}
        setPageNo={setPageNo}
        setPageSize={setPageSize}
        totalPages={totalPages}
        selectedEmpCheckbox={selectedEmpCheckbox}
        setSelectedEmpCheckbox={setSelectedEmpCheckbox}
      />
    </>
  );
};

export default App;


// filter=%7B%22gender%22%3A%22%22%2C%22isPermanent%22%3A%22%22%2C%22yearOfExperience%22%3A%7B%22start%22%3A%22%22%2C%22end%22%3A%22%22%7D%2C%22salary%22%3A%7B%22start%22%3A%22%22%2C%22end%22%3A%22%22%7D%7D&pageNo=1&pageSize=5&sorting=%7B%22name%22%3A0%2C%22email%22%3A0%2C%22locality%22%3A0%2C%22skills%22%3A0%2C%22yearOfExperience%22%3A0%2C%22salary%22%3A0%2C%22isPermanent%22%3A0%7D&searching=%7B%22searchText%22%3A%22%22%2C%22searchingField%22%3A%22%22%7D