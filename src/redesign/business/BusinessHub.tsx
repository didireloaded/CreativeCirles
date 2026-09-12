import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  Check,
  Copy,
  Edit3,
  Package,
  Pause,
  Store,
  Users,
} from "lucide-react";
import type { Page } from "../types";
import "../opportunities/opportunities.css";
import "./business.css";
import { useLocalState } from "../storage";
import BottomSheet from "../components/BottomSheet";
type Service = {id:string;title:string;description:string;rate:string;paused:boolean};
type View = "Services" | "Bookings" | "Products" | "Memberships" | "Insights";
const views: View[] = [
  "Services",
  "Bookings",
  "Products",
  "Memberships",
  "Insights",
];
export default function BusinessHub({
  notify,
  navigate,
}: {
  notify: (m: string) => void;
  navigate: (p: Page | string) => void;
}) {
  const [view, setView] = useState<View>("Services");
  const [services,setServices] = useLocalState<Service[]>("business-services",[{id:"portrait",title:"Editorial portrait session",description:"Concept call, half-day shoot, 12 carefully finished images.",rate:"N$650/hour · N$2,800/half-day · N$5,200/full-day",paused:false}]);
  const [editing,setEditing] = useState<Service|null>(null);
  const [booking, setBooking] = useLocalState("booking-stage", "Discussing");
  const [product,setProduct] = useLocalState("product-listing",{title:"Creative pitch layouts",description:"Editorial presentation templates for small teams."});
  const [productForm,setProductForm] = useState<typeof product|null>(null);
  const [benefits,setBenefits] = useLocalState("free-tier-benefits","Public work and updates");
  const [benefitForm,setBenefitForm] = useState<string|null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    if (viewParam && views.includes(viewParam as View)) {
      setView(viewParam as View);
    }
    if (params.get("create") === "true") {
      if (viewParam === "Products") {
        setProductForm(product);
      } else {
        setEditing({id:crypto.randomUUID(),title:"",description:"",rate:"",paused:false});
      }
    }
  }, []);
  return (
    <main className="business-page">
      <header className="business-hero">
        <button
          className="icon-button"
          onClick={() => navigate("tools")}
          aria-label="Back to creative tools"
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">YOUR CREATIVE BUSINESS · PREVIEW</p>
          <h1>Creator business</h1>
          <p>
            Offer your work, manage inquiries, and understand the shape of your
            practice.
          </p>
        </div>
        <Store />
      </header>
      <nav className="business-tabs" role="tablist">
        {views.map((x) => (
          <button
            role="tab"
            aria-selected={view === x}
            key={x}
            onClick={() => setView(x)}
          >
            {x}
          </button>
        ))}
      </nav>
      <section className="business-panel">
        {view === "Services" && (
          <>
            <div className="business-heading">
              <div>
                <p className="eyebrow">SERVICES</p>
                <h2>What people can hire you for.</h2>
              </div>
              <button
                className="button primary"
                onClick={() => setEditing({id:crypto.randomUUID(),title:"",description:"",rate:"",paused:false})}
              >
                Add service
              </button>
            </div>
            {services.map(service => <article className="service-card" key={service.id}>
              <span>
                <Briefcase />
              </span>
              <div>
                <small>SERVICE · {service.paused ? "PAUSED" : "AVAILABLE"}</small>
                <h3>{service.title}</h3>
                <p>
                  {service.description}
                </p>
                <div>
                  <b>{service.rate}</b>
                </div>
              </div>
              <div>
                <button
                  className="icon-button"
                  aria-label="Edit service"
                  onClick={() => setEditing(service)}
                >
                  <Edit3 />
                </button>
                <button
                  className="icon-button"
                  aria-label="Duplicate service"
                  onClick={() => setServices(current => [...current,{...service,id:crypto.randomUUID(),title:`${service.title} (copy)`,paused:true}])}
                >
                  <Copy />
                </button>
                <button
                  className="icon-button"
                  aria-label="Pause service"
                  onClick={() => setServices(current => current.map(item=>item.id===service.id?{...item,paused:!item.paused}:item))}
                >
                  {service.paused ? <Check /> : <Pause />}
                </button>
              </div>
            </article>)}
          </>
        )}
        {view === "Bookings" && (
          <>
            <div className="business-heading">
              <div>
                <p className="eyebrow">INQUIRY PIPELINE</p>
                <h2>From first message to delivery.</h2>
              </div>
            </div>
            <article className="booking-card">
              <div>
                <small>EDITORIAL PORTRAIT SESSION</small>
                <h3>North Studio campaign</h3>
                <p>Requested for 26 October · local inquiry preview</p>
              </div>
              <label>
                Status
                <select
                  value={booking}
                  onChange={(e) => setBooking(e.target.value)}
                >
                  {[
                    "New",
                    "Discussing",
                    "Quote Sent",
                    "Confirmed",
                    "In Progress",
                    "Delivered",
                    "Completed",
                    "Declined",
                    "Cancelled",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <button
                className="button secondary"
                onClick={() => navigate("inbox?chat=nia")}
              >
                Open conversation
              </button>
              <button
                className="button primary"
                onClick={() => navigate("projects")}
              >
                View projects
              </button>
            </article>
          </>
        )}
        {view === "Products" && (
          <div className="product-grid">
            <article>
              <Package />
              <small>LUT PACK · VERSION 2</small>
              <h3>Quiet desert tones</h3>
              <p>12 cinematic looks with a concise licensing summary.</p>
              <b>N$320 · price presentation</b>
              <button
                className="button secondary"
                onClick={() =>
                  notify("Product saved locally. Sales are coming later.")
                }
              >
                Sales coming later
              </button>
            </article>
            <article>
              <Package />
              <small>TEMPLATE PACK · DRAFT</small>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <button
                className="button secondary"
                onClick={() => setProductForm(product)}
              >
                Edit listing
              </button>
            </article>
          </div>
        )}
        {view === "Memberships" && (
          <div className="membership-grid">
            {["Free", "Supporter", "VIP"].map((x, i) => (
              <article key={x}>
                <Users />
                <h3>{x}</h3>
                <p>
                  {i === 0
                    ? benefits
                    : i === 1
                      ? "Behind-the-scenes notes and early access"
                      : "Studio sessions, resources, and monthly Q&A"}
                </p>
                <b>
                  {i === 0
                    ? "Always available"
                    : i === 1
                      ? "N$80/month · preview"
                      : "N$220/month · preview"}
                </b>
                <button
                  className="button secondary"
                  onClick={() => i === 0 ? setBenefitForm(benefits) : notify("Subscriptions become available when payments launch.")}
                >
                  {i === 0 ? "Edit benefits" : "Coming later"}
                </button>
              </article>
            ))}
          </div>
        )}
        {view === "Insights" && (
          <div className="revenue-preview">
            <div>
              <p className="eyebrow">SAMPLE REVENUE · NO MONEY COLLECTED</p>
              <h2>N$ 28,450</h2>
              <span>Illustrative 30-day total</span>
            </div>
            <BarChart3 />
            <div
              className="revenue-bars"
              role="img"
              aria-label="Sample revenue: services 62 percent, products 21 percent, subscriptions 12 percent, tips 5 percent"
            >
              <span style={{ width: "62%" }}>Services 62%</span>
              <span style={{ width: "42%" }}>Products 21%</span>
              <span style={{ width: "27%" }}>Subscriptions 12%</span>
              <span style={{ width: "16%" }}>Tips 5%</span>
            </div>
            <p>
              Support and tips are presentation-only until payments are
              introduced.
            </p>
          </div>
        )}
      </section>
      <BottomSheet open={Boolean(editing)} title="Service details" onClose={()=>setEditing(null)}>{editing&&<form className="product-editor" onSubmit={e=>{e.preventDefault();setServices(current=>current.some(x=>x.id===editing.id)?current.map(x=>x.id===editing.id?editing:x):[...current,editing]);setEditing(null);}}><label>Service name<input required value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})}/></label><label>Deliverables<textarea required value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})}/></label><label>Rates<input required value={editing.rate} onChange={e=>setEditing({...editing,rate:e.target.value})}/></label><button className="button primary">Save service</button></form>}</BottomSheet>
      <BottomSheet open={Boolean(productForm)} title="Product listing" onClose={()=>setProductForm(null)}>{productForm&&<form className="product-editor" onSubmit={e=>{e.preventDefault();setProduct(productForm);setProductForm(null);}}><label>Product name<input required value={productForm.title} onChange={e=>setProductForm({...productForm,title:e.target.value})}/></label><label>Description<textarea required value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})}/></label><button className="button primary">Save listing</button></form>}</BottomSheet>
      <BottomSheet open={benefitForm!==null} title="Free membership benefits" onClose={()=>setBenefitForm(null)}><form className="product-editor" onSubmit={e=>{e.preventDefault();setBenefits(benefitForm||"");setBenefitForm(null);}}><label>Benefits<textarea required value={benefitForm||""} onChange={e=>setBenefitForm(e.target.value)}/></label><button className="button primary">Save benefits</button></form></BottomSheet>
    </main>
  );
}
