import React from 'react';

const Dashboard = () => {

  return (
    <div className="flex h-screen">
      <aside className="bg-gray-900 text-white flex-none w-64 p-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <nav className="mt-6">
          <a
            href="/dashboard"
            className="flex items-center py-2 px-4 text-gray-400 hover:bg-gray-700 hover:text-white rounded"
          >
            <i class="fas fa-chart-bar pr-4"></i>
            Dashboard
          </a>
          <a
            href="/dashboard"
            className="flex items-center py-2 px-4 mt-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded"
          >
            <i class="fas fa-users pr-4"></i>
            Users
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-6 mt-6">
<link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"/>
<link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"/>

<div class="flex flex-wrap bg-white">
    <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
        <div class="flex-auto p-4">
        <div class="flex flex-wrap">
            <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 class="text-blueGray-400 uppercase font-bold text-xs"> Traffic</h5>
            <span class="font-semibold text-xl text-blueGray-700">334,100</span>
            </div>
            <div class="relative w-auto pl-4 flex-initial">
            <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                <i class="fas fa-chart-bar"></i>
            </div>
            </div>
        </div>
        <p class="text-sm text-blueGray-400 mt-4">
            <span class="text-emerald-500 mr-2"><i class="fas fa-arrow-up"></i> 2,99% </span>
            <span class="whitespace-nowrap"> Since last month </span></p>
        </div>
    </div>
    </div>

    <div class=" mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg">
        <div class="flex-auto p-4">
        <div class="flex flex-wrap">
            <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 class="text-blueGray-400 uppercase font-bold text-xs">New users</h5>
            <span class="font-semibold text-xl text-blueGray-700">2,999</span>
            </div>
            <div class="relative w-auto pl-4 flex-initial">
            <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                <i class="fas fa-chart-pie"></i>
            </div>
            </div>
        </div>
        <p class="text-sm text-blueGray-400 mt-4">
            <span class="text-red-500 mr-2"><i class="fas fa-arrow-down"></i> 4,01%</span>
            <span class="whitespace-nowrap"> Since last week </span></p>
        </div>
    </div>
    </div>

    <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div class="flex-auto p-4">
        <div class="flex flex-wrap">
            <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 class="text-blueGray-400 uppercase font-bold text-xs">Recipes Added</h5>
            <span class="font-semibold text-xl text-blueGray-700">901</span>
            </div>
            <div class="relative w-auto pl-4 flex-initial">
            <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-lightBlue-500">
                <i class="fas fa-users"></i>
            </div>
            </div>
        </div>
        <p class="text-sm text-blueGray-400 mt-4">
            <span class="text-red-500 mr-2"><i class="fas fa-arrow-down"></i> 1,25% </span>
            <span class="whitespace-nowrap"> Since yesterday </span></p>
        </div>
    </div>
    </div>

    <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div class="flex-auto p-4">
        <div class="flex flex-wrap">
            <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 class="text-blueGray-400 uppercase font-bold text-xs">Performance</h5>
            <span class="font-semibold text-xl text-blueGray-700">51.02% </span>
            </div>
            <div class="relative w-auto pl-4 flex-initial">
            <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-emerald-500">
                <i class="fas fa-percent"></i>
            </div>
            </div>
        </div>
        <p class="text-sm text-blueGray-400 mt-4">
            <span class="text-emerald-500 mr-2"><i class="fas fa-arrow-up"></i>12%</span>
            <span class="whitespace-nowrap"> Since last mounth </span></p>
        </div>
    </div>
    </div>
</div>
        {/* Additional content here */}
      </main>
    </div>
  );
};

export default Dashboard;
