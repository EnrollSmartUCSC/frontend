import { className, plan } from "@/types/api";
import { useDroppable } from "@dnd-kit/core";
import { IconButton } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSchedule } from "@/context/ScheduleContext";

export default function QuarterPlannerPage({season, year, plan, setPlan}: {
  season: string;
  year: number;
  plan: plan;
  setPlan: (plan: plan) => void;
}) {
  const quarterId = `${season} ${year}`;
                   
                  const { isOver, setNodeRef } = useDroppable({
                    id: quarterId,
                  });
                  const courses = plan[quarterId] || [];
                  const { removeCourse, fetchSchedule} = useSchedule();
                  
                  async function handleDelete (course: className) {
                    await removeCourse(course.catalog_nbr, course.subject, quarterId);
                    const newPlan = await fetchSchedule();
                    setPlan(newPlan);
                    };
                  
                return (
                    <td
                      key={quarterId}
                      ref={setNodeRef}
                      className={`border p-2 align-top relative ${
                        isOver ? "bg-green-100" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="space-y-2 mb-12">
                        {courses.map((c) => (
                          <div
                            key={`${c.subject}-${c.catalog_nbr}-${c.title}`}
                            className="bg-blue-100 rounded-md p-2 text-xs shadow-sm"
                          >
                            <div className="font-semibold truncate">
                              {c.subject} {c.catalog_nbr} — {c.title}
                            </div>
                            <IconButton onClick={() => {
                              handleDelete(c);
                            }}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </div>
                        ))}
                      </div>
  
                      {/* <button
                        onClick={() =>
                          router.push(`/dashboard/tab-2/${quarterId}`)
                        }
                        className="absolute bottom-2 right-2 text-blue-600 hover:underline text-sm"
                      >
                        View
                      </button> */}
                    </td>)
}