import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import axiosInstance from '../../../api/axiosInstance';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const groupValidation = Yup.object({
  title: Yup.string().min(3).required('Required'),
  details: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  image: Yup.mixed(),
});

const initialValue = {
  title: '',
  details: '',
  category: '',
  image: '',
};

const GroupCreation = () => {
  const { mutate: grpCreation, isPending } = useMutation({
    mutationFn: async (grpData) => {
      const { data } = await axiosInstance.post('/user/creategroup', grpData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
  });

  const handleSubmit = (values,{resetForm}) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('details', values.details);
    formData.append('category', values.category);
    formData.append('image', values.image);
    grpCreation(formData,{
      onSuccess: (data) => {
        toast.success(data?.message || 'Group created successfully!', {
          position: 'top-right',
        });
        resetForm()

      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'An error occurred', {
          position: 'top-right',
        });
      },
      
    });
  };

  return (
    <div className="rounded-lg shadow-md bg-white mb-10">
      <div className="border-b border-gray-300 py-2 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg h-14">
        <h1 className="font-medium text-white">Peer Group Creation</h1>
      </div>

      <Formik initialValues={initialValue} validationSchema={groupValidation} onSubmit={handleSubmit}>
        {({ setFieldValue }) => (
          <Form>
            <div className="flex flex-col p-8 mx-auto max-w-2xl gap-4 text-sm text-gray-600">
              <div>
                <h1 className="font-semibold text-gray-700 mb-2">Group Title</h1>
                <Field
                  name="title"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="text"
                  placeholder="Group Title"
                />
                <ErrorMessage name="title" component="small" className="text-red-500 text-xs mt-1 block" />
              </div>
                <Field
                  as="textarea"
                  name="details"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Group Details"
                />
                <ErrorMessage name="details" component="small" className="text-red-500 text-xs mt-1 block" />

              <div>
                <h1 className="font-semibold text-gray-700 mb-2">Category</h1>
                <Field
                  as="select"
                  name="category"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">SELECT CATEGORY</option>
                  {[
                    'art/creativity',
                    'cooking',
                    'computer/it',
                    'outdoor/sports',
                    'languages',
                    'consulting',
                    'beauty/health',
                    'education',
                    'music',
                    'others',
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category.toUpperCase()}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="small" className="text-red-500 text-xs mt-1 block" />
              </div>

              <div>
                <h1 className="font-semibold text-gray-700 mb-2">Group Image</h1>
                <input
                  name="image"
                  type="file"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setFieldValue('image', e.target.files[0])}
                />
                <ErrorMessage name="image" component="small" className="text-red-500 text-xs mt-1 block" />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={isPending}
                >
                  {isPending ? (
                   <span className="flex items-center justify-center">  Loading <FaSpinner className="animate-spin ml-2" /></span>
                  ) : (
                    'Create Group'
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GroupCreation;