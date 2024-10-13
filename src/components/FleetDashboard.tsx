import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import HeaderTitle from "./HeaderTitle";
import CustomTable from "./CustomTable";
import CustomPagination from "./CustomPagination";
import DropdownMenu from "./DropdownMenu";
import InputComponent from "./InputComponent";
import LargeButton from "./LargeButton";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import TextButton from "./TextButton";
import StarButton from "./StarButton";
import {
  TableCell,
  TableRow,
  Checkbox,
  TableHead,
  TableBody,
  TableContainer,
  Table,
} from "@mui/material";
import useDebounce from "../hooks/useDebounce";

interface Location {
  id: number;
  name: string;
  isActive: boolean;
  robot: { id: string; is_online: boolean };
  type: string;
  starred: boolean;
}

const locationsPerPage = 6;

const FleetDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filter, setFilter] = useState<string>("All Locations");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Use the debounce hook for the search query with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const searchParam = debouncedSearchQuery
          ? `?search=${debouncedSearchQuery}`
          : "";
        const filterParam = filter === "Starred" ? "?starred=true" : "";

        const [locationsRes, starredRes] = await Promise.all([
          axios.get(`/locations${searchParam}${filterParam}`),
          axios.get("/starred_location_ids"),
        ]);

        const starredIds = starredRes.data.location_ids;
        const updatedLocations = locationsRes.data.locations.map(
          (loc: Location) => ({
            ...loc,
            starred: starredIds.includes(loc.id),
            isActive: false, // Default isActive to false if not provided by API
            type: loc.type || "Unknown", // Provide a fallback if necessary
          })
        );

        setLocations(updatedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedSearchQuery, filter]);

  const toggleStarred = async (locationId: number) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === locationId ? { ...loc, starred: !loc.starred } : loc
    );

    setLocations(updatedLocations);

    const starredIds = updatedLocations
      .filter((loc) => loc.starred)
      .map((loc) => loc.id);

    try {
      await axios.put("/starred_location_ids", starredIds);
    } catch (error) {
      console.error("Error updating starred locations:", error);
      setLocations(locations);
      alert("Could not star an item due to unexpected error");
    }
  };

  const handleCheckboxChange = (locationId: number) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === locationId ? { ...loc, isActive: !loc.isActive } : loc
    );
    setLocations(updatedLocations);
  };

  const handleCheckAll = () => {
    const allChecked = locations.every((location) => location.isActive);
    const updatedLocations = locations.map((loc) => ({
      ...loc,
      isActive: !allChecked,
    }));
    setLocations(updatedLocations);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const getFilteredLocations = () => {
    let filteredLocations = [...locations];

    if (filter === "Starred") {
      filteredLocations = filteredLocations.filter(
        (location) => location.starred
      );
    }

    if (debouncedSearchQuery) {
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          location.robot.id
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      );
    }

    return filteredLocations;
  };

  const paginatedLocations = getFilteredLocations().slice(
    (currentPage - 1) * locationsPerPage,
    currentPage * locationsPerPage
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value || "");
    setCurrentPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const renderRow = (location: Location) => (
    <TableRow key={location.id}>
      <TableCell padding="checkbox" style={{ width: "5%" }}>
        <Checkbox
          checked={location.isActive}
          onChange={() => handleCheckboxChange(location.id)}
        />
      </TableCell>
      <TableCell style={{ width: "5%" }}>
        <StarButton
          starred={location.starred}
          onClick={() => toggleStarred(location.id)}
        />
      </TableCell>
      <TableCell style={{ width: "45%" }}>
        <LargeButton
          hasRightArrow={true}
          label={location.name}
          isActive={location.isActive}
          onClick={() => {}}
        />
      </TableCell>
      <TableCell style={{ width: "25%" }}>
        {location.robot.is_online ? (
          <>
            <FiberManualRecordIcon style={{ color: "#00D15E" }} />
            {location.robot.id}
          </>
        ) : (
          <TextButton label="Add" onClick={() => {}} underline={true} />
        )}
      </TableCell>
      <TableCell style={{ width: "20%" }}>{location.type}</TableCell>
    </TableRow>
  );

  return (
    <FullWidthContainer>
      <HeaderTitle text="Your Fleet" fontSize="24px" fontWeight="bold" />
      <DashboardHeader>
        <DropdownMenu
          options={["All Locations", "Starred", "Serving", "Disinfection"]}
          value={filter}
          onChange={handleFilterChange}
        />
        <InputComponent
          placeholder="Search robot or location"
          onSearch={handleSearchChange}
        />
      </DashboardHeader>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" style={{ width: "5%" }}>
                    <Checkbox
                      indeterminate={
                        locations.some((loc) => loc.isActive) &&
                        !locations.every((loc) => loc.isActive)
                      }
                      onChange={handleCheckAll}
                    />
                  </TableCell>
                  <TableCell style={{ width: "5%" }}>
                    <span>&#8635;</span> {/* You can use an icon here */}
                  </TableCell>
                  <TableCell style={{ width: "45%" }}>Locations</TableCell>
                  <TableCell style={{ width: "25%" }}>Robots</TableCell>
                  <TableCell style={{ width: "20%" }}>Location Types</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{paginatedLocations.map(renderRow)}</TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={Math.ceil(getFilteredLocations().length / locationsPerPage)}
            onChange={handlePageChange}
            page={currentPage}
          />
        </>
      )}
    </FullWidthContainer>
  );
};

export default FleetDashboard;

const FullWidthContainer = styled.div`
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
`;
