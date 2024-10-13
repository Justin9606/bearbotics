import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import TextButton from "./TextButton";
import HeaderTitle from "./HeaderTitle";
import CustomTable from "./CustomTable";
import CustomPagination from "./CustomPagination";
import DropdownMenu from "./DropdownMenu";
import InputComponent from "./InputComponent";
import StarButton from "./StarButton";
import CheckboxComponent from "./CheckboxComponent";
import LargeButton from "./LargeButton";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  TableContainer,
  Table,
} from "@mui/material";

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

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const [locationsRes, starredRes] = await Promise.all([
          axios.get("/locations"),
          axios.get("/starred_location_ids"),
        ]);

        const starredIds = starredRes.data.location_ids;
        const updatedLocations = locationsRes.data.locations.map(
          (loc: Location) => ({
            ...loc,
            starred: starredIds.includes(loc.id),
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
  }, []);

  // Handle starring and un-starring locations
  const toggleStarred = async (locationId: number) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === locationId ? { ...loc, starred: !loc.starred } : loc
    );

    // Update state immediately to trigger re-render
    setLocations(updatedLocations);

    const starredIds = updatedLocations
      .filter((loc) => loc.starred)
      .map((loc) => loc.id);

    try {
      await axios.put("/starred_location_ids", starredIds);
    } catch (error) {
      console.error("Error updating starred locations:", error);
      // If there's an error, revert the state change
      setLocations(locations);
      alert("Could not star an item due to unexpected error");
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (locationId: number) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === locationId ? { ...loc, isActive: !loc.isActive } : loc
    );
    setLocations(updatedLocations);
  };

  // Handle "check all" checkbox
  const handleCheckAll = () => {
    const allChecked = locations.every((location) => location.isActive);
    const updatedLocations = locations.map((loc) => ({
      ...loc,
      isActive: !allChecked,
    }));
    setLocations(updatedLocations);
  };

  // Handle dropdown filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  // Filter the locations based on dropdown value and search query
  const getFilteredLocations = () => {
    let filteredLocations = [...locations];

    // Apply filter based on dropdown selection
    if (filter === "Starred") {
      // Only show locations that are starred
      filteredLocations = filteredLocations.filter(
        (location) => location.starred === true
      );
    } else if (filter === "Serving") {
      filteredLocations = filteredLocations.filter(
        (location) => location.type === "Serving"
      );
    } else if (filter === "Disinfection") {
      filteredLocations = filteredLocations.filter(
        (location) => location.type === "Disinfection"
      );
    }

    // Apply search query filter
    if (searchQuery) {
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.robot.id.toLowerCase().includes(searchQuery.toLowerCase())
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
      <TableCell padding="checkbox">
        <CheckboxComponent
          checked={location.isActive}
          onChange={() => handleCheckboxChange(location.id)} // Independent checkbox logic
        />
      </TableCell>
      <TableCell>
        <StarButton
          starred={location.starred}
          onClick={() => toggleStarred(location.id)} // Independent star logic
        />
      </TableCell>
      <TableCell>
        <LargeButton
          hasRightArrow={true}
          label={location.name}
          isActive={location.isActive}
          onClick={() => {}}
        />
      </TableCell>
      <TableCell>
        {location.robot.is_online ? (
          <>
            <FiberManualRecordIcon
              style={{ color: "#00D15E", fontSize: "small" }}
            />
            {location.robot.id}
          </>
        ) : (
          <TextButton label="Add" onClick={() => {}} underline={true} />
        )}
      </TableCell>
      <TableCell>{location.type}</TableCell>
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
                  <TableCell padding="checkbox">
                    <CheckboxComponent
                      checked={locations.every((location) => location.isActive)}
                      onChange={handleCheckAll} // For the "check all" checkbox
                    />
                  </TableCell>
                  <TableCell></TableCell> {/* Star button header (empty) */}
                  <TableCell>Locations</TableCell>
                  <TableCell>Robots</TableCell>
                  <TableCell>Location Types</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLocations.map((location) => renderRow(location))}
              </TableBody>
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
