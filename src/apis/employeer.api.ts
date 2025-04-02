import apiClient from "./apiClient";



// Fetch all employees
// export const apiGetEmployees = async (page: number, limit: number) => {
//     try {
//         const response = await apiClient.get(`/employees?page=${page}&limit=${limit}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching employees", error);
//         throw error;
//     }
// };

export const apiGetEmployees = async (
    page: number,
    limit: number,
    sortFields?: string[],  // Danh sách field cần sort (VD: ["name", "address"])
    sortOrders?: ("asc" | "desc")[]  // Danh sách hướng sort (VD: ["asc", "desc"])
) => {
    try {
        // Tạo query string động
        let query = `/employees?page=${page}&limit=${limit}`;

        if (sortFields && sortOrders && sortFields.length === sortOrders.length) {
            query += `&sortFields=${sortFields.join(",")}&sortOrders=${sortOrders.join(",")}`;
        }
        const response = await apiClient.get(query);
        return response.data;
    } catch (error) {
        console.error("Error fetching employees", error);
        throw error;
    }
};


// Fetch an employee by ID
export const apiGetEmployeeById = async (id: string) => {
    try {
        const response = await apiClient.get(`/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching employee", error);
        throw error;
    }
};

// Create a new employee
export const apiCreateEmployee = async (employeeData: any) => {
    try {
        const response = await apiClient.post("/employees", employeeData);
        return response.data;
    } catch (error) {
        console.error("Error creating employee", error);
        throw error;
    }
};

// Update an employee
export const apiUpdateEmployee = async (id: string, employeeData: any) => {
    try {
        const response = await apiClient.put(`/employees/${id}`, employeeData);
        return response.data;
    } catch (error) {
        console.error("Error updating employee", error);
        throw error;
    }
};

// Delete an employee
export const apiDeleteEmployee = async (id: string) => {
    try {
        const response = await apiClient.delete(`/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting employee", error);
        throw error;
    }
};
