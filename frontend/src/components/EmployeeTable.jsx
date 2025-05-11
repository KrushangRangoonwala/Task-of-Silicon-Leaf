import React, { useEffect, useState } from 'react';
import './EmployeeTable.css';
import Pagination from './Pagination';

const EmployeeTable = ({
  employees,
  sorting,
  setSorting,
  pageNo,
  pageSize,
  setPageSize,
  totalPages,
  setPageNo,
  setSelectedEmpCheckbox,
  selectedEmpCheckbox,
}) => {

  const [isAllChecked, setIsAllChecked] = useState(false)

  function getNextSortingMethod(val) {
    switch (val) {
      case 0: return 1;
      case 1: return -1;
      case -1: return 0;
      default: return val;
    }
  }

  function handleSorting(fieldName) {

    const val = sorting[fieldName];
    const newVal = getNextSortingMethod(val);
    setSorting({ ...sorting, [fieldName]: newVal });
  }
  // function handleSorting(newFieldName) {
  //   const fieldName = sorting.fieldName;
  //   if (newFieldName === fieldName) {
  //     const val = sorting.val;
  //     const newVal = getNextSortingMethod(val);
  //     setSorting({ ...sorting, val: newVal });
  //   } else {
  //     setSorting({ ...sorting, fieldName: newFieldName, val: 1 });
  //   }
  // }

  function setSortingIcon(fieldName) {
    const val = sorting[fieldName];
    switch (val) {
      case 0: return <><sup><i className="bi bi-caret-up supClass"></i></sup><sub><i className="bi bi-caret-down subClass"></i>  </sub></>
      case 1: return <sup><i className="bi bi-caret-up-fill subSupNormal"></i></sup>
      case -1: return <sub><i className="bi bi-caret-down-fill subSupNormal"></i></sub>
      default: break;
    }
  }

  function handleCheckboxChange(email, isChecked) {
    if (isChecked) {
      setSelectedEmpCheckbox(prev => [...prev, email]);
    } else {
      const tempArr = selectedEmpCheckbox.filter((val) => val !== email);
      setSelectedEmpCheckbox([...tempArr]);
    }
  }

  function handleTitleCheckboxChange(isChecked) {
    if (isChecked) {
      const newData = employees.map((emp) => emp.email);
      setIsAllChecked(true);
      setSelectedEmpCheckbox(prev => [...prev,...newData]);
    } else {
      const emailList = employees.map((emp) => emp.email);
      setIsAllChecked(false);
      const tempArr = selectedEmpCheckbox.filter((val) => emailList.includes(val) === false);
      setSelectedEmpCheckbox([...tempArr]);
      // setSelectedEmpCheckbox([]);
    }
  }
  function setTitleCheckbox() {
    return employees.every((emp) => {
      return selectedEmpCheckbox.includes(emp.email)
    })
  }

  function getChecked(email) {
    const isMarked = selectedEmpCheckbox.includes(email);
    if (isMarked) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    console.log("selectedEmpCheckbox ", selectedEmpCheckbox)
  }, [selectedEmpCheckbox])

  const StatusChips = ({ type }) => {
    return (
      <span className={`chip ${type === "Permanent" ? "permanent" : "temporary"}`}>
        {type}
      </span>
    );
  };

  return (
    <>



      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              {console.log("setTitleCheckbox ",setTitleCheckbox())}
              <th><input type="checkbox" onChange={(e) => handleTitleCheckboxChange(e.target.checked)} checked={setTitleCheckbox()}/></th>
              <th>Sr no</th>
              <th onClick={() => handleSorting('name')} className='tableHead'>Name{' '} {setSortingIcon('name')}</th>
              <th onClick={() => handleSorting('email')} className='tableHead'>Email{' '} {setSortingIcon('email')}</th>
              <th>Gender</th>
              <th onClick={() => handleSorting('locality')} className='tableHead'>Locality{' '} {setSortingIcon('locality')}</th>
              <th onClick={() => handleSorting('yearOfExperience')} className='tableHead'>Year of <br/>Experience{' '} {setSortingIcon('yearOfExperience')}</th>
              <th onClick={() => handleSorting('salary')} className='tableHead'>Salary{' '} {setSortingIcon('salary')}</th>
              <th onClick={() => handleSorting('isPermanent')} className='tableHead'>Type{' '} {setSortingIcon('isPermanent')}</th>
            </tr>
          </thead>
          {employees?.length > 0 ?
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index}>
                  <td><input type="checkbox" value={emp.email} onChange={(e) => handleCheckboxChange(emp.email, e.target.checked)} checked={getChecked(emp.email)} /></td>
                  <td>{(pageNo - 1) * pageSize + index + 1}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.locality}</td>
                  <td>{emp.yearOfExperience}</td>
                  <td>{emp.salary}</td>
                  <td><StatusChips type={emp.isPermanent ? 'Permanent' : 'Temporary'}/></td>
                </tr>
              ))}
            </tbody>
            : <tbody>
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>No Data Found</td>
              </tr>
            </tbody>}
        </table>


        <Pagination totalPages={totalPages} pageSize={pageSize} setPageSize={setPageSize} pageNo={pageNo} setPageNo={setPageNo} />
      </div>
    </>
  );
};

export default EmployeeTable;
