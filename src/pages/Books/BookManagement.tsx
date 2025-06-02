import React, { useState, useEffect, useCallback } from 'react';
import { useFetchData } from '@/helper/FetchDataHelper';
import {
  GetBooksResponseSchema,
  AddBookRequestSchema,
  UpdateBookRequestSchema,
  DeleteBookRequestSchema,
  OutputBaseSchema,
} from '@/model/book.model'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar"; 
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Loading from '@/component/Loading';
import { z } from 'zod';

const BooksManagementPage: React.FC = () => {
  const [books, setBooks] = useState<z.infer<typeof GetBooksResponseSchema>["data"]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<z.infer<typeof GetBooksResponseSchema>["data"][0] | null>(null);

  // Form state for adding/editing books
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState<number | string>(''); // Use string for input, convert to number
  const [category, setCategory] = useState('');

  // API hooks
  const { fetchData: fetchBooksAPI, ...setFecthBooksAPI} =
    useFetchData<z.infer<typeof GetBooksResponseSchema>>();

  const { fetchData: addBookAPI, loading: addingBook, error: addBookError, errorResponse: addBookErrorResponse, success: addBookSuccess } =
    useFetchData<z.infer<typeof OutputBaseSchema>>();

  const { fetchData: updateBookAPI, loading: updatingBook, error: updateBookError, errorResponse: updateBookErrorResponse, success: updateBookSuccess } =
    useFetchData<z.infer<typeof OutputBaseSchema>>();

  const { fetchData: deleteBookAPI, loading: deletingBook, error: deleteBookError, errorResponse: deleteBookErrorResponse, success: deleteBookSuccess } =
    useFetchData<z.infer<typeof OutputBaseSchema>>();

  const loadBooks = useCallback(() => {
    setIsLoadingBooks(true);
    fetchBooksAPI({
      url: '/template/GetBooks', 
      method: 'GET',
      schema: GetBooksResponseSchema,
    });
  }, [fetchBooksAPI]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    if (setFecthBooksAPI.data) {
      setBooks(setFecthBooksAPI.data.data || []);
      setIsLoadingBooks(false);
    }
  }, [setFecthBooksAPI.data]);

  useEffect(() => {
    if (setFecthBooksAPI.error) {
      const apiErrorMessage = setFecthBooksAPI.data?.errorMessage;
      const generalMessage = setFecthBooksAPI.errorResponse?.message;
      toast.error(`Failed to fetch books: ${apiErrorMessage || generalMessage || 'Unknown error'}`);
      setIsLoadingBooks(false);
    }
  }, [setFecthBooksAPI.error, setFecthBooksAPI.errorResponse]);

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setYear('');
    setCategory('');
    setShowAddForm(false);
    setShowEditForm(null);
  };

  useEffect(() => {
    if (addBookSuccess) {
      toast.success("Book added successfully!");
      resetForm();
      loadBooks();
    }
    if (addBookError) {
      toast.error(`Failed to add book: ${addBookErrorResponse || 'Unknown error'}`);
    }
  }, [addBookSuccess, addBookError, addBookErrorResponse, loadBooks]);

  useEffect(() => {
    if (updateBookSuccess) {
      toast.success("Book updated successfully!");
      resetForm();
      loadBooks();
    }
    if (updateBookError) {
      toast.error(`Failed to update book: ${updateBookErrorResponse || 'Unknown error'}`);
    }
  }, [updateBookSuccess, updateBookError, updateBookErrorResponse, loadBooks]);
  
  useEffect(() => {
    if (deleteBookSuccess) {
      toast.success("Book deleted successfully!");
      loadBooks();
    }
    if (deleteBookError) {
      toast.error(`Failed to delete book: ${deleteBookErrorResponse || 'Unknown error'}`);
    }
  }, [deleteBookSuccess, deleteBookError, deleteBookErrorResponse, loadBooks]);


  const handleAddBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedYear = parseInt(String(year), 10);
    if (isNaN(parsedYear)) {
      toast.error("Year must be a valid number.");
      return;
    }
    const bookPayload: z.infer<typeof AddBookRequestSchema> = { title: title, author: author, year: parsedYear, category: category };

    const validationResult = AddBookRequestSchema.safeParse(bookPayload);
    if (!validationResult.success) {
      validationResult.error.errors.forEach(err => toast.error(err.message));
      return;
    }

    addBookAPI({
      url: '/template/AddBook',
      method: 'POST',
      schema: OutputBaseSchema, // success/fail response
      axiosConfig: { 
        data: validationResult.data 
      },
    });
  };

  const handleEditBook = (book: z.infer<typeof GetBooksResponseSchema>["data"][0]) => {
    setShowEditForm(book);
    setShowAddForm(false); // Close add form if open
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
    setCategory(book.category);
  };
  
  const handleUpdateBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showEditForm) return;

    const parsedYear = parseInt(String(year), 10);
    if (isNaN(parsedYear)) {
        toast.error("Year must be a valid number.");
        return;
    }

    const updatePayload: z.infer<typeof UpdateBookRequestSchema> = { id: showEditForm.id, title: title, author: author, year: parsedYear, category: category };

    const validationResult = UpdateBookRequestSchema.safeParse(updatePayload);
    if (!validationResult.success) {
      validationResult.error.errors.forEach(err => toast.error(err.message));
      return;
    }
    
    updateBookAPI({
      url: '/template/UpdateBook',
      method: 'PATCH',
      schema: OutputBaseSchema,
      axiosConfig: { 
        data: validationResult.data 
      },
    });
  };

  const handleDeleteBook = (bookId: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const deletePayload: z.infer<typeof DeleteBookRequestSchema> = { id: bookId };
      deleteBookAPI({
        url: '/template/DeleteBook',
        method: 'DELETE', 
        schema: OutputBaseSchema,
        axiosConfig: { 
            data: deletePayload 
        },
      });
    }
  };

  const currentFormSubmitHandler = showEditForm ? handleUpdateBook : handleAddBook;
  const currentFormTitle = showEditForm ? "Edit Book" : "Add New Book";

  if (isLoadingBooks || setFecthBooksAPI.loading) { // Initial load or subsequent fetches
    return <Loading />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Books Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="p-4 md:p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Books Management</h1>
            {!showAddForm && !showEditForm && (
                <Button onClick={() => {
                    setShowAddForm(true);     
                    setShowEditForm(null);    
                    setTitle('');
                    setAuthor('');
                    setYear('');
                    setCategory('');
                }}>Add New Book</Button>
            )}
          </div>

          {(showAddForm || showEditForm) && (
            <Card>
              <CardHeader>
                <CardTitle>{currentFormTitle}</CardTitle>
                <CardDescription>Fill in the details below.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={currentFormSubmitHandler} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Title" required />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author Name" required />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Publication Year" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Book Category" required />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addingBook || updatingBook}>
                      {addingBook || updatingBook ? 'Saving...' : (showEditForm ? 'Update Book' : 'Add Book')}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Book List</CardTitle>
              <CardDescription>Overview of all available books.</CardDescription>
            </CardHeader>
            <CardContent>
              {books.length === 0 && !isLoadingBooks && <p>No books found.</p>}
              <div className="space-y-4">
                {books.map((book) => (
                  <Card key={book.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
                    <div>
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">By {book.author} ({book.year})</p>
                      <p className="text-sm">Category: {book.category}</p>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button variant="outline" size="sm" onClick={() => handleEditBook(book)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteBook(book.id)} disabled={deletingBook}>
                        {deletingBook ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BooksManagementPage;